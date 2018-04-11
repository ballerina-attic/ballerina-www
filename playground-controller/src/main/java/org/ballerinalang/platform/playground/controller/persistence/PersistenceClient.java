package org.ballerinalang.platform.playground.controller.persistence;

import java.util.List;

public interface PersistenceClient {
    public void addFreeLauncher(String launcherUrl);

    public void removeLauncher(String launcherUrl);

    public List<String> getFreeLauncherUrls();

    public List<String> getBusyLauncherUrls();

    public List<String> getTotalLauncherUrls();

    public void markLauncherAsFree(String launcherUrl);

    public void markLauncherAsBusy(String launcherUrl);
}
