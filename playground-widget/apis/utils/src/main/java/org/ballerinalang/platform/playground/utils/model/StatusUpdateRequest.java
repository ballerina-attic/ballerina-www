package org.ballerinalang.platform.playground.utils.model;

import com.google.gson.annotations.SerializedName;

public class StatusUpdateRequest {
    @SerializedName("launcher-url")
    private String launcherUrl;

    @SerializedName("status")
    private String status;

    public String getLauncherUrl() {
        return launcherUrl;
    }

    public void setLauncherUrl(String launcherUrl) {
        this.launcherUrl = launcherUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
