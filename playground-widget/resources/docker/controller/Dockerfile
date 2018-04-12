FROM anapsix/alpine-java:8_jdk

LABEL maintainer "dev@wso2.org"

RUN mkdir -p /srv
COPY playground-controller-0.8-SNAPSHOT.jar /srv/

CMD [ "java", "-jar", "/srv/playground-controller-0.8-SNAPSHOT.jar" ]