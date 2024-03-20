package com.pacbytes.v1.owncp;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/* DaoUtils 类
工具类，封装两个操作 update 和 query
基本操作大同小异，获得一个连接，预编译语句，补齐语句，返回结果，释放资源
 */
public class DaoUtils {
    private static Config config;
    private static ConnectionPool connectionPool;

    // 工具类，在静态块里初始化连接池
    static {
        config = new Config();
        connectionPool = new ConnectionPool(config);
    }

    // 定义 PPT 给出的结构 MyHandler 接口，调用时候完成 handle 方法，用泛型 T 才好处理不同的数据
    public interface MyHandler<T> {
        T handle(ResultSet resultSet) throws Exception;
    }

    public static int update(String sql, Object... params) {
        Connection connection = null;
        PreparedStatement statement = null;
        try {
            // 获取连接
            connection = connectionPool.getConnection();
            // 预编译语句
            statement = connection.prepareStatement(sql);
            // 补齐语句
            setParameters(statement, params);
            return statement.executeUpdate();
        } catch (Exception e) {
            // 处理异常
            e.printStackTrace();
            return -1;
        } finally {
            // 释放资源
            closeResources(statement);
            connectionPool.recycleConnection(connection);
        }
    }

    public static <T> T query(String sql, MyHandler<T> handler, Object... params) {
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        try {
            // 获取连接
            connection = connectionPool.getConnection();
            // 预编译语句
            statement = connection.prepareStatement(sql);
            setParameters(statement, params);
            // 执行语句，获得结果集
            resultSet = statement.executeQuery();
            // 处理结果集
            return handler.handle(resultSet);
        } catch (Exception e) {
            // 处理异常
            e.printStackTrace();
            return null;
        } finally {
            // 释放资源
            closeResources(resultSet, statement);
            connectionPool.recycleConnection(connection);
        }
    }

    // 设置占位符参数，补齐语句
    private static void setParameters(PreparedStatement statement, Object... params) throws Exception {
        for (int i = 0; i < params.length; i++) {
            // PreparedStatement 参数位置从 1 开始计数
            statement.setObject(i + 1, params[i]);
        }
    }

    // 释放资源
    private static void closeResources(AutoCloseable... resources) {
        for (AutoCloseable resource : resources) {
            if (resource != null) {
                try {
                    resource.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
