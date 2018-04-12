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
package org.ballerinalang.platform.playground.api.core.cache.adaptor;

import org.ballerinalang.platform.playground.utils.RedisClient;

/**
 * Cache Storage Adaptor for Redis
 */
public class RedisCacheStorageAdaptor implements CacheStorageAdaptor {

    private RedisClient redisClient;

    public RedisCacheStorageAdaptor() {
        redisClient = new RedisClient();
    }

    public String get(String key) {
        return redisClient.getReadClient().get(key);
    }

    public boolean contains(String key) {
        return redisClient.getReadClient().exists(key);
    }

    public void set(String key, String value) {
        redisClient.getWriteClient().set(key, value);
    }
}
