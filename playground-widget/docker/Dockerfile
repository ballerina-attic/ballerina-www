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
FROM openjdk:jre-alpine

RUN apk update && apk add bash && apk add curl

COPY ballerina-tools*.zip /root/
RUN mkdir /ballerina \
    && unzip /root/ballerina-tools*.zip -d /ballerina/ \
    && mv /ballerina/ballerina* /ballerina/runtime \
    && mkdir -p /ballerina/runtime/logs

ENV BALLERINA_HOME /ballerina/runtime
ENV PATH $BALLERINA_HOME/bin:$PATH

COPY www /var/www/html/
COPY composer /ballerina/runtime/bin/
COPY ballerina /ballerina/runtime/bin/
RUN chmod +x /ballerina/runtime/bin/composer
RUN chmod +x /ballerina/runtime/bin/ballerina
COPY composer-config.yml /ballerina/runtime/resources/composer/conf/
COPY netty-transports.yml /ballerina/runtime/resources/composer/services/
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY CUSTOMER_DB.h2.db /sample-db/
COPY backend_time_service.bal /services/
COPY legacy_service.bal /services/

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]