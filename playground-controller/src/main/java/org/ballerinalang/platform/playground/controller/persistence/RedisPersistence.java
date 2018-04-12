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
package org.ballerinalang.platform.playground.controller.persistence;

import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.controller.util.ControllerUtils;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.ScanParams;
import redis.clients.jedis.ScanResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Redis Persistence
 */
public class RedisPersistence implements Persistence {

    // Redis keys
    private static final String CACHE_KEY_LAUNCHERS_LIST = "CACHE_KEY_FREE_LAUNCHERS_LIST";

    // Redis write instance
    private Jedis master;

    // Redis read instance
    private Jedis slave;

    public RedisPersistence() {
        master = new Jedis(ControllerUtils.getEnvStringValue(Constants.ENV_BPG_REDIS_WRITE_HOST),
                ControllerUtils.getEnvIntValue(Constants.ENV_BPG_REDIS_WRITE_PORT));
        slave = new Jedis(ControllerUtils.getEnvStringValue(Constants.ENV_BPG_REDIS_READ_HOST),
                ControllerUtils.getEnvIntValue(Constants.ENV_BPG_REDIS_READ_PORT));
    }

    @Override
    public void addFreeLaunchers(List<String> launcherUrls) {
        Map<String, String> launchers = launcherUrls.stream()
                .collect(Collectors.toMap((url) -> url, (url) -> Constants.MEMBER_STATUS_FREE));
        master.hmset(CACHE_KEY_LAUNCHERS_LIST, launchers);

    }

    @Override
    public void addFreeLauncher(String launcherUrl) {
        master.hset(CACHE_KEY_LAUNCHERS_LIST, launcherUrl, Constants.MEMBER_STATUS_FREE);
    }

    @Override
    public void unregisterLauncher(String launcherUrl) {
        if (master.hexists(CACHE_KEY_LAUNCHERS_LIST, launcherUrl)) {
            master.hdel(CACHE_KEY_LAUNCHERS_LIST, launcherUrl);
        }
    }

    @Override
    public List<String> getFreeLauncherUrls() {
        return searchLaunchersByStatus(Constants.MEMBER_STATUS_FREE);
    }

    @Override
    public List<String> getBusyLauncherUrls() {
        return searchLaunchersByStatus(Constants.MEMBER_STATUS_BUSY);
    }

    @Override
    public List<String> getTotalLauncherUrls() {
        return new ArrayList<>(slave.hkeys(CACHE_KEY_LAUNCHERS_LIST));
    }

    @Override
    public boolean markLauncherAsFree(String launcherUrl) {
        master.hset(CACHE_KEY_LAUNCHERS_LIST, launcherUrl, Constants.MEMBER_STATUS_FREE);
        return true;
    }

    @Override
    public boolean markLauncherAsBusy(String launcherUrl) {
        master.hset(CACHE_KEY_LAUNCHERS_LIST, launcherUrl, Constants.MEMBER_STATUS_BUSY);
        return true;
    }

    @Override
    public boolean launcherExists(String launcherUrl) {
        return slave.hexists(CACHE_KEY_LAUNCHERS_LIST, launcherUrl);
    }

    private List<String> searchLaunchersByStatus(String status) {
        List<String> freeLaunchers = new ArrayList<>();
        int cursor = -1;
        ScanParams params = new ScanParams();
        params.match(status);
        while (cursor != 0) {
            ScanResult<Map.Entry<String, String>> result
                    = slave.hscan(CACHE_KEY_LAUNCHERS_LIST, cursor == -1 ? 0 : cursor, params);
            cursor = result.getCursor();
            result.getResult()
                    .forEach((entry) -> {
                        freeLaunchers.add(entry.getKey());
                    });
        }
        return freeLaunchers;
    }
}
