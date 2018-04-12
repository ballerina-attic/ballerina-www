FROM anapsix/alpine-java:8_jdk

LABEL maintainer="dev@wso2.org"

RUN mkdir -p /api
COPY playground-controller-0.8-SNAPSHOT.jar /api/
COPY netty-transports.yml /api/

CMD [ "java", "-jar", "-Dtransports.netty.conf=/api/netty-transports.yml", "/api/playground-controller-0.8-SNAPSHOT.jar" ]