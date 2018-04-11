package org.ballerinalang.platform.playground.controller.util;

public class Constants {
    public static final String BPG_APP_TYPE_LAUNCHER = "bpg-launcher";
    public static final String LAUNCHER_URL_PREFIX = "launcher";

    // Controller roles
    public static final String CONTROLLER_ROLE_API_SERVER = "API_SERVER";
    public static final String CONTROLLER_ROLE_DESIRED_COUNT_CHECK = "DESIRED_CHECK";
    public static final String CONTROLLER_ROLE_MAX_COUNT_CHECK = "MAX_CHECK";

    // Environment variable keys
    public static final String ENV_CONTROLLER_ROLE = "BPG_CONTROLLER_ROLE";
    public static final String ENV_BPG_NAMESPACE = "BPG_NAMESPACE";
    public static final String ENV_LAUNCHER_IMAGE_NAME = "BPG_LAUNCHER_IMAGE_NAME";
    public static final String ENV_STEP_UP = "BPG_SCALING_STEP_UP";
    public static final String ENV_STEP_DOWN = "BPG_SCALING_STEP_DOWN";
    public static final String ENV_DESIRED_COUNT = "BPG_SCALING_DESIRED";
    public static final String ENV_MAX_COUNT = "BPG_SCALING_MAX";
    public static final String ENV_FREE_BUFFER = "BPG_SCALING_FREE_BUFFER";

    // Member status values
    public static final String MEMBER_STATUS_FREE = "FREE";
    public static final String MEMBER_STATUS_BUSY = "BUSY";
    public static final String DOMAIN_PLAYGROUND_BALLERINA_IO = "playground.ballerina.io";

    // Launcher environment variables
    public static final String ENV_BPG_REDIS_WRITE_HOST = "BPG_REDIS_WRITE_HOST";
    public static final String ENV_BPG_REDIS_WRITE_PORT = "BPG_REDIS_WRITE_PORT";
    public static final String ENV_BPG_REDIS_READ_HOST = "BPG_REDIS_READ_HOST";
    public static final String ENV_BPG_REDIS_READ_PORT = "BPG_REDIS_READ_PORT";
    public static final String ENV_DB_HOST = "DB_HOST";
    public static final String ENV_DB_PORT = "DB_PORT";
    public static final String ENV_BPG_LAUNCHER_SELF_URL = "BPG_LAUNCHER_SELF_URL";
    public static final String ENV_IS_LAUNCHER_CACHE = "BPG_LAUNCHER_CACHE_NODE";
}
