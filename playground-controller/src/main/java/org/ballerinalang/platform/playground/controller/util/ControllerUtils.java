package org.ballerinalang.platform.playground.controller.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ControllerUtils {

    private static final Logger log = LoggerFactory.getLogger(ControllerUtils.class);

    public static String getEnvStringValue(String key) {
        if (key != null) {
            return System.getenv(key);
        } else {
            log.warn("Null key queried for environment variable");
            return null;
        }
    }

    public static int getEnvIntValue(String key) {
        String rawValue = getEnvStringValue(key);
        if (rawValue != null) {
            try {
                return Integer.parseInt(rawValue);
            } catch (NumberFormatException e) {
                log.warn("Couldn't parse value set for environment variable " + key);
                return 0;
            }
        } else {
            log.warn("No value found for environment variable " + key);
            return 0;
        }
    }
}
