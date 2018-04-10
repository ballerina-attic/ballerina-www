/*
 * Copyright (c) 2018, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.ballerinalang.platform.playground.api.core;

import redis.clients.jedis.Jedis;

/**
 * Cache Storage
 */
public class CacheStorage {

    private static final int REDIS_DEFAULT_PORT = 6379;

    private static final String REDIS_WRITE_HOST = "BPG_REDIS_WRITE_HOST";

    private static final String REDIS_READ_HOST = "BPG_REDIS_READ_HOST";

    private Jedis master;

    private Jedis slave;

    public CacheStorage() {
        master = new Jedis(System.getenv(REDIS_WRITE_HOST));
//        slave = new Jedis(System.getenv(REDIS_READ_HOST));
//        slave.slaveof(REDIS_WRITE_HOST, REDIS_DEFAULT_PORT);
    }

    public synchronized String get(String key) {
        return master.get(key);
    }

    public synchronized boolean contains(String key) {
        return get(key) != null;
    }

    public synchronized void set(String key, String value) {
        master.set(key, value);
    }
}
