# --------------------------------------------------------------------
# Copyright (c) 2017, WSO2 Inc. (http://wso2.com) All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# -----------------------------------------------------------------------
FROM openjdk:latest

RUN apt-get update
RUN apt-get -y install apache2

env APACHE_RUN_USER    www-data
env APACHE_RUN_GROUP   www-data
env APACHE_PID_FILE    /var/run/apache2.pid
env APACHE_RUN_DIR     /var/run/apache2
env APACHE_LOCK_DIR    /var/lock/apache2
env APACHE_LOG_DIR     /var/log/apache2

RUN mkdir $APACHE_RUN_DIR
COPY ballerina-tools*.zip /root/
RUN unzip /root/ballerina-tools*.zip -d /ballerina/ > /dev/null 2>&1 \
    && mv /ballerina/ballerina* /ballerina/runtime \
    && mkdir -p /ballerina/runtime/logs \
    && rm -rf /root/${BALLERINA_DIST} > /dev/null 2>&1


ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/jre
ENV BALLERINA_HOME /ballerina/runtime
ENV PATH $BALLERINA_HOME/bin:$PATH

COPY www /var/www/html/
COPY composer /ballerina/runtime/bin/
RUN chmod +x /ballerina/runtime/bin/composer
COPY composer-config.yml /ballerina/runtime/resources/composer/conf/
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]