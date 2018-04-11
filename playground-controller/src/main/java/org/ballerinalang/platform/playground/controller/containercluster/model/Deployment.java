package org.ballerinalang.platform.playground.controller.containercluster.model;

import org.ballerinalang.platform.playground.controller.util.Constants;

public class Deployment implements Comparable {

    private String name;

    private String namespace;

    private long age;
//
//    private int desired;
//
//    private int current;
//
//    private int upToDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public long getAge() {
        return age;
    }

    public void setAge(long age) {
        this.age = age;
    }

    @Override
    public int compareTo(Object o) {
        int mySuffix = Integer.parseInt(this.name.substring((Constants.BPG_APP_TYPE_LAUNCHER + "-").length()));
        int otherSuffix = Integer.parseInt(((Deployment) o).name.substring((Constants.BPG_APP_TYPE_LAUNCHER + "-").length()));

        return Integer.compare(mySuffix, otherSuffix);
    }
//
//    public int getDesired() {
//        return desired;
//    }
//
//    public void setDesired(int desired) {
//        this.desired = desired;
//    }
//
//    public int getCurrent() {
//        return current;
//    }
//
//    public void setCurrent(int current) {
//        this.current = current;
//    }
//
//    public int getUpToDate() {
//        return upToDate;
//    }
//
//    public void setUpToDate(int upToDate) {
//        this.upToDate = upToDate;
//    }


}


