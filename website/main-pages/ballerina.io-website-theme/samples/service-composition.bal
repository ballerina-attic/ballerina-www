import ballerina/http;

endpoint http:Client airlineEP {
    url:"http://localhost:9091/airline"
};

endpoint http:Client hotelEP {
    url:"http://localhost:9092/hotel"
};

@http:ServiceConfig {basePath:"/travel"}
service<http:Service> travelAgencyService bind { port: 9090 } {

    @http:ResourceConfig {
        methods:["POST"]
    }
    arrangeTour(endpoint client, http:Request inRequest) {
        json inReqPayload = check inRequest.getJsonPayload();
        json outReqPayload = {
                                "Name":inReqPayload.Name, 
                                "ArrivalDate":inReqPayload.ArrivalDate, 
                                "DepartureDate":inReqPayload.DepartureDate, 
                                "Preference":""
                             };

        outReqPayload.Preference = inReqPayload.Preference.Airline;
        http:Response inResAirline = check airlineEP->post(
            "/reserve", untaint outReqPayload);
        // Implement the business logic for the retrieved response

        outReqPayload.Preference = inReqPayload.Preference.Accommodation;
        http:Response inResHotel = check hotelEP->post(
            "/reserve", untaint outReqPayload);
        // Implement the business logic for the retrieved response

        http:Response outResponse;
        outResponse.setJsonPayload({"Message":"Congratulations! " + 
            "Your journey is ready!!"});
        _ = client->respond(outResponse);
    }
}