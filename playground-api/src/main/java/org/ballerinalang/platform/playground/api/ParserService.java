/*
 * Copyright (c) 2018, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.ballerinalang.platform.playground.api;

import org.ballerinalang.composer.service.ballerina.parser.service.BallerinaParserService;
import org.ballerinalang.composer.service.ballerina.parser.service.model.BFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.Consumes;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Ballerina Parser Service for playground
 */
@Path("/api/parser")
public class ParserService {

    private BallerinaParserService parserService = new BallerinaParserService();

    private static final Logger logger = LoggerFactory.getLogger(ParserService.class);

    @OPTIONS
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateAndParseOptions() {
        return parserService.validateAndParseOptions();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateAndParseBFile(BFile bFileRequest) {
        Response response = null;
        try {
            response = parserService.validateAndParseBFile(bFileRequest);
        } catch (Exception e) {
            response = Response
                        .serverError()
                        .entity(e.getMessage())
                        .build();
            logger.error("Error while validate and parse ", e);
        }
        return response;
    }
}
