package com.pacbytes.v1.owncp;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.Driver;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Properties;

/*
Config 类
用来配置数据源（DataSource）的读取方式，也用来初始化连接池，
需要变量：原始池大小，最大池大小（容纳连接数），多久没连接会被清理，
是否定时清理，第一次清理的时间，清理周期，池满了后多久重新获得连接
用户名，密码，驱动，驱动url
 */
public class Config {
    private static final int DEFAULT_POOL_SIZE = 3;

    private volatile int maxPoolSize;
    private volatile int connectionTimeout;
    private volatile String username;
    private volatile String password;

    private String driver;
    private String jdbcUrl;
    private long firstCheckTime;
    private long checkPeriod;
    private long waitTimeAfterPoolFull;

    private boolean checkHealth;

    public Config(String fileName) {
        try {
            Properties prop = loadProperties(fileName);

            for (Object obj : prop.keySet()) {
                String fieldName = obj.toString().replace("jdbc.", "");
                Field field = this.getClass().getDeclaredField(fieldName);
                Method method = this.getClass().getMethod(toUpperAndConcat("set", fieldName), String.class);
                method.invoke(this, prop.get(obj));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public Config() {
        this("cp.properties");
    }

    // 获得带前缀和大写首字母的拼接字符串，比如输入 set username, 输出为 setUsername，注意不是 setUsername
    private String toUpperAndConcat(String prefix, String propName) {
        return prefix + propName.substring(0, 1).toUpperCase(Locale.ENGLISH) + propName.substring(1);
    }

    private Properties loadProperties(String fileName) {
        File propFile = new File(fileName);
        // 是或者不是文件名（路径）
        // 写在括号里面确保资源及时关闭
        try (InputStream stream = propFile.isFile() ? new FileInputStream(propFile) : getClass().getResourceAsStream(fileName)) {
            if (stream == null) {
                throw new IllegalArgumentException("Cannot find property file: " + fileName);
            }

            Properties prop = new Properties();
            prop.load(stream);
            return prop;

        } catch (IOException io) {
            throw new RuntimeException("Failed to read property file", io);
        }
    }

    public int getDefaultPoolSize() {
        return DEFAULT_POOL_SIZE;
    }

    public int getMaxPoolSize() {
        return maxPoolSize;
    }

    public void setMaxPoolSize(String maxPoolSizeString) {
        int maxPoolSize = Integer.parseInt(maxPoolSizeString);
        if (maxPoolSize < 1) {
            throw new IllegalArgumentException("maxPoolSize cannot be less than 1");
        }
        this.maxPoolSize = maxPoolSize;
    }

    public int getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(String connectionTimeoutString) {
        int connectionTimeout = Integer.parseInt(connectionTimeoutString);
        // timeout 为 0，设置为 int 最大数值
        if (connectionTimeout == 0) {
            this.connectionTimeout = Integer.MAX_VALUE;
        }
        else if (connectionTimeout < 0) {
            throw new IllegalArgumentException("connectionTimeout cannot be negative");
        }
        else {
            this.connectionTimeout = connectionTimeout;
        }
    }

    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username){
        this.username = username;
    }

    public String getPassword(){
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getJdbcUrl()
    {
        return jdbcUrl;
    }

    public void setJdbcUrl(String jdbcUrl)
    {
        this.jdbcUrl = jdbcUrl;
    }


    public long getFirstCheckTime() {
        return firstCheckTime;
    }

    public void setFirstCheckTime(String firstCheckTimeString) {
        this.firstCheckTime = Long.parseLong(firstCheckTimeString);
    }


    public long getCheckPeriod() {
        return checkPeriod;
    }

    public void setCheckPeriod(String checkPeriodString) {

        this.checkPeriod = Long.parseLong(checkPeriodString);
    }

    public long getWaitTimeAfterPoolFull() {
        return waitTimeAfterPoolFull;
    }

    public void setWaitTimeAfterPoolFull(String waitTimeAfterPoolFullString) {
        this.waitTimeAfterPoolFull = Long.parseLong(waitTimeAfterPoolFullString);
    }

    public boolean ifCheckHealth() {
        return checkHealth;
    }
    public void setCheckHealth(String checkHealth) {
        this.checkHealth = Boolean.getBoolean(checkHealth);
    }

    @Override
    public String toString() {
        return "DataSourceConfig{" +
                "driver='" + driver + '\'' +
                ", jdbcUrl='" + jdbcUrl + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", maxPoolSize=" + maxPoolSize +
                ", connectionTimeout=" + connectionTimeout +
                ", checkHealth=" + checkHealth +
                ", firstCheckTime=" + firstCheckTime +
                ", checkPeriod=" + checkPeriod +
                ", waitTimeAfterPoolFull=" + waitTimeAfterPoolFull +
                '}';
    }

}

