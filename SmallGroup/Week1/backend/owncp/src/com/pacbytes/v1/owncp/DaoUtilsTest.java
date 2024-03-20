package com.pacbytes.v1.owncp;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class DaoUtilsTest {

    private static ConnectionPool connectionPool;

    @BeforeAll
    static void setUp() {
        // 初始化连接池
        Config config = new Config();
        connectionPool = new ConnectionPool(config);
    }

    @AfterAll
    static void shutDown() {
        // 关闭连接池
        connectionPool.close();
    }

    @Test
    void testUpdate() {
        // 测试更新操作
        String sql = "UPDATE test_table SET col_1 = ? WHERE id = ?";
        int affectedRows = DaoUtils.update(sql,1, 1);
        // 假设更新一行数据，期望受影响的行数为 1
        assertEquals(1, affectedRows);
    }

    @Test
    void testQuery() {
        // 测试查询操作
        String sql = "SELECT * FROM test_table WHERE id = ?";
        // 假设查询到一行数据，返回该行数据的某个字段的值，用 lambda 吧
        DaoUtils.MyHandler<String> handler = resultSet -> {
            if (resultSet.next()) {
                return resultSet.getString("col_1");
            }
            return null;
        };
        String result = DaoUtils.query(sql, handler, 1);
        // 期望查询结果不为空
        assertNotNull(result);
    }
}
