package org.ballerinalang.platform.playground.controller.util;

public class Constants {
    public static final String BPG_APP_TYPE_LAUNCHER = "bpg-launcher";
    public static final String LAUNCHER_URL_PREFIX = "launcher";

    // Controller roles
    public static final String CONTROLLER_ROLE_API_SERVER = "API_SERVER";
    public static final String CONTROLLER_ROLE_MIN_CHECK = "MIN_CHECK";
    public static final String CONTROLLER_ROLE_IDLE_CHECK = "IDLE_CHECK";

    // Environment variable keys
    public static final String ENV_CONTROLLER_ROLE = "BPG_CONTROLLER_ROLE";
    public static final String ENV_BPG_NAMESPACE = "BPG_NAMESPACE";
    public static final String ENV_LAUNCHER_IMAGE_NAME = "BPG_LAUNCHER_IMAGE_NAME";
    public static final String ENV_STEP_UP = "BPG_SCALING_STEP_UP";
    public static final String ENV_STEP_DOWN = "BPG_SCALING_STEP_DOWN";
    public static final String ENV_MIN_COUNT = "BPG_SCALING_MIN";
    public static final String ENV_MAX_COUNT = "BPG_SCALING_MAX";
    public static final String ENV_LIMIT_GAP = "BPG_SCALING_LIMIT_GAP";
    public static final String ENV_IDLE_TIMEOUT = "BPG_SCALING_IDLE_TIMEOUT_MIN";
}
