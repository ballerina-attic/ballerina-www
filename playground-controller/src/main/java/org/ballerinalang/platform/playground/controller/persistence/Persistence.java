package org.ballerinalang.platform.playground.controller.persistence;

import java.util.List;

public interface Persistence {
    public void addFreeLauncher(String launcherUrl);

    public void unregisterLauncher(String launcherUrl);

    public List<String> getFreeLauncherUrls();

    public List<String> getBusyLauncherUrls();

    public List<String> getTotalLauncherUrls();

    public boolean markLauncherAsFree(String launcherUrl);

    public boolean markLauncherAsBusy(String launcherUrl);

    public boolean launcherExists(String launcherUrl);
}
