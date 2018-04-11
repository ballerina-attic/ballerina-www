package org.ballerinalang.platform.playground.controller.service.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class LauncherResponse implements Serializable {

    @SerializedName("launcher-url")
    private String launcherUrl;

    public LauncherResponse(String launcherUrl) {
        this.launcherUrl = launcherUrl;
    }

    public LauncherResponse() {
        this.launcherUrl = "";
    }

    public String getLauncherUrl() {
        return launcherUrl;
    }

    public void setLauncherUrl(String launcherUrl) {
        this.launcherUrl = launcherUrl;
    }
}
