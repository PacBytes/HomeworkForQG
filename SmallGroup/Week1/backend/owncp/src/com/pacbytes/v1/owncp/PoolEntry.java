package com.pacbytes.v1.owncp;

import java.sql.Connection;
import java.sql.SQLException;

/*
PoolEntry 类
连接池单个实例，管理着该连接和其相关信息，比如
lastAccessed：最后一次访问时间戳
Connection 对象
提供基本方法：
getter 方法
 */
public class PoolEntry {
    private long lastAccessed;
    private Connection connection;

    // 构造方法，初始化该实例的时候可以更新一下 lastAccessed 的值，并获取一个连接
    public PoolEntry(long createTime, Connection connection){
        this.lastAccessed = createTime;
        this.connection = connection;
    }

    public void close() {
        try {
            if (this.connection != null && !this.connection.isClosed()) {
                this.connection.close();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public long getLastAccessed() {
        return lastAccessed;
    }

    public Connection getConnection() {
        return connection;
    }
}
