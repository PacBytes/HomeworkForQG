package com.pacbytes.v1.owncp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Vector;
import java.util.concurrent.atomic.AtomicInteger;

/*
ConnectionPool 类
连接池的主要实现，主要功能就是：
1. 维护连接池（使用中，空闲）
2. 定时检查超时连接并清理
3. 提供 Connection 的 getter（创建可以看情况单独封装出来）
4. 提供回收 Connection 的方法（不用频繁创建销毁，可以提高复用率）
5. 获得空闲连接数

涉及到的变量：创建连接数，空闲连接池（放 Connection）
活跃连接池（放 PoolEntry（为了更好的封装一些信息））
 */
public class ConnectionPool {
    // 加载配置类
    Config config;

    // 建立数据结构：空闲池和活跃池
    // ArrayList 不是 synchronized，为了多线程安全，选择 vector
    private AtomicInteger useableConnectionNum = new AtomicInteger(0);
    Vector<Connection> freePools = new Vector<Connection>();
    Vector<PoolEntry> activePools = new Vector<PoolEntry>();
    private boolean poolState;

    // 构造函数，获取配置，执行初始化方法
    public ConnectionPool(Config config) {
        this.config = config;
        this.poolState = true;
        init();
    }

    // 注册驱动，填充空闲池，开启超时检查
    private void init() {
        try {
            Class.forName(config.getDriver());
            for (int i = 0; i < config.getDefaultPoolSize(); ++i) {
                Connection connection = createConnection();
                freePools.add(connection);
            }
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        healthCheck();
    }

    private void healthCheck() {
        if (config.ifCheckHealth()) {
            Checker checker = new Checker();
            new Timer().schedule(checker, config.getFirstCheckTime(), config.getCheckPeriod());
        }
    }

    class Checker extends TimerTask {
        // 遍历连接池，计算连接池超时时间，超过阀值则清理
        public void run() {
            for (int i = 0; i < activePools.size(); ++i) {
                PoolEntry entry = activePools.get(i);
                long startTime = entry.getLastAccessed();
                long currentTime = System.currentTimeMillis();
                try {
                    if (currentTime -  startTime > config.getConnectionTimeout()) {
                        // 超时了，获得对应连接，准备清理
                        Connection connection = entry.getConnection();
                        if (connection != null && !connection.isClosed()) {
                            // 连接已关闭，记得递减连接数
                            connection.close();
                            activePools.remove(i);
                            useableConnectionNum.decrementAndGet();
                        }
                    }
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    public synchronized Connection createConnection() {
        Connection connection = null;
        try {
            // 申请一个连接
            connection = DriverManager.getConnection(config.getJdbcUrl(), config.getUsername(), config.getPassword());
            useableConnectionNum.incrementAndGet();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return connection;
    }

    // 业务逻辑：空闲池有多余的连接则返回，否则创建新连接，如果超过最大连接数则等待回收
    public synchronized Connection getConnection() {
        Connection connection = null;
        if (!freePools.isEmpty()) {
            connection = freePools.getFirst();
            freePools.removeFirst();
        }
        else if (useableConnectionNum.get() < config.getMaxPoolSize()) {
            connection = createConnection();
        } else {
            try {
                wait(config.getWaitTimeAfterPoolFull());
                return getConnection(); // 递归调用
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        PoolEntry poolEntry = new PoolEntry(System.currentTimeMillis(), connection);
        activePools.add(poolEntry);
        return poolEntry.getConnection();
    }

    public synchronized void recycleConnection (Connection connection) {
        // 检测连接是否合法：存在且没有被关闭
        try {
            if (connection != null && !connection.isClosed()) {
                freePools.add(connection);
                for (int i = 0; i < activePools.size(); ++i) {
                    if (activePools.get(i).getConnection() == connection) {
                        activePools.remove(i);
                        break;
                    }
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public synchronized void close() {
        try {
            this.poolState = false;

            for (PoolEntry entry : activePools) {
                entry.close();
            }

            for (Connection connection : freePools) {
                try {
                    if (connection != null && !connection.isClosed()) {
                        connection.close();
                    }
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
