import ballerina/http;

endpoint http:Client airlineReservationEP {
    url:"http://localhost:9091/airline"
};

endpoint http:Client hotelReservationEP {
    url:"http://localhost:9092/hotel"
};

endpoint http:Client carRentalEP {
    url:"http://localhost:9093/car"
};

@http:ServiceConfig {basePath:"/travel"}
service<http:Service> travelAgencyService bind { port: 9090 } {

    @http:ResourceConfig {
        methods:["POST"]
    }
    arrangeTour(endpoint client, http:Request inRequest) {
        json inReqPayload = check inRequest.getJsonPayload();
        json outReqPayload = {"Name":inReqPayload.Name, "ArrivalDate":inReqPayload.ArrivalDate, 
                            "DepartureDate":inReqPayload.DepartureDate, "Preference":""};

        json outReqPayloadAirline = outReqPayload;
        outReqPayloadAirline.Preference = inReqPayload.Preference.Airline;
        http:Response inResAirline = check airlineReservationEP->post("/reserve", untaint outReqPayloadAirline);

        var airlineResPayload = check inResAirline.getJsonPayload();
        string airlineStatus = airlineResPayload.Status.toString();
        json outReqPayloadHotel = outReqPayload;
        outReqPayloadHotel.Preference = inReqPayload.Preference.Accommodation;
        http:Response inResHotel = check hotelReservationEP->post("/reserve", untaint outReqPayloadHotel);

        var hotelResPayload = check inResHotel.getJsonPayload();
        string hotelStatus = hotelResPayload.Status.toString();
        json outReqPayloadCar = outReqPayload;
        outReqPayloadCar.Preference = inReqPayload.Preference.Car;
        http:Response inResCar = check carRentalEP->post("/rent", untaint outReqPayloadCar);

        var carResPayload = check inResCar.getJsonPayload();
        string carRentalStatus = carResPayload.Status.toString();
        http:Response outResponse;
        outResponse.setJsonPayload({"Message":"Congratulations! Your journey is ready!!"});
        _ = client->respond(outResponse);
    }
}