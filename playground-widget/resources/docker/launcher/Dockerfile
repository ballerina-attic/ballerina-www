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

ENV ENABLE_DEBUG false
ENV DEBUG_PORT 5005

RUN apk update && apk add bash && apk add curl

COPY ballerina-tools.zip /root/

RUN mkdir /ballerina \
    && unzip /root/ballerina-tools.zip -d /ballerina/ \
    && mv /ballerina/ballerina* /ballerina/runtime \
    && mkdir -p /ballerina/runtime/logs \
    && rm /root/ballerina-tools.zip

ENV BALLERINA_HOME /ballerina/runtime
ENV PATH $BALLERINA_HOME/bin:$PATH

RUN mkdir /api/
COPY netty-transports.yml /api/
COPY ballerinaKeystore.p12 /api/
COPY playground-api.jar /api/
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY CUSTOMER_DB.h2.db /sample-db/
COPY backend_time_service.balx /services/
COPY legacy_service.balx /services/
COPY stock_quote_service.balx /services/

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]