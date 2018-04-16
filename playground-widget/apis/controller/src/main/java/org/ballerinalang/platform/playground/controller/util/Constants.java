package org.ballerinalang.platform.playground.controller.util;

public class Constants {
    public static final String BPG_APP_TYPE_LAUNCHER = "bpg-launcher";
    public static final String LAUNCHER_URL_PREFIX = "launcher";

    // Controller roles
    public static final String CONTROLLER_ROLE_API_SERVER = "API_SERVER";
    public static final String CONTROLLER_ROLE_DESIRED_COUNT_CHECK = "DESIRED_CHECK";
    public static final String CONTROLLER_ROLE_MAX_COUNT_CHECK = "MAX_CHECK";
    public static final String CONTROLLER_ROLE_URL_VALIDATOR = "URL_VALIDATOR";

    // Environment variable keys
    public static final String ENV_CONTROLLER_ROLE = "BPG_CONTROLLER_ROLE";
    public static final String ENV_BPG_NAMESPACE = "BPG_NAMESPACE";
    public static final String ENV_LAUNCHER_IMAGE_NAME = "BPG_LAUNCHER_IMAGE_NAME";
    public static final String ENV_STEP_UP = "BPG_SCALING_STEP_UP";
    public static final String ENV_STEP_DOWN = "BPG_SCALING_STEP_DOWN";
    public static final String ENV_DESIRED_COUNT = "BPG_SCALING_DESIRED";
    public static final String ENV_MAX_COUNT = "BPG_SCALING_MAX";
    public static final String ENV_FREE_BUFFER = "BPG_SCALING_FREE_BUFFER";

    public static final String DOMAIN_PLAYGROUND_BALLERINA_IO = "playground.ballerina.io";

    public static final String ENV_DB_HOST = "DB_HOST";
    public static final String ENV_DB_PORT = "DB_PORT";
    public static final String ENV_BGP_NFS_SERVER_IP = "BGP_NFS_SERVER_IP";
}
