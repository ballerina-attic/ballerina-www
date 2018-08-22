import ballerina/http;

// Client endpoint to communicate with Airline reservation service
endpoint http:Client airlineReservationEP {
    url:"http://localhost:9091/airline"
};

// Client endpoint to communicate with Hotel reservation service
endpoint http:Client hotelReservationEP {
    url:"http://localhost:9092/hotel"
};

// Client endpoint to communicate with Car rental service
endpoint http:Client carRentalEP {
    url:"http://localhost:9093/car"
};

// Travel agency service to arrange a complete tour for a user
@http:ServiceConfig {basePath:"/travel"}
service<http:Service> travelAgencyService bind { port: 9090 } {

    // Resource to arrange a tour
    @http:ResourceConfig {
        methods:["POST"]
    }
    arrangeTour(endpoint client, http:Request inRequest) {
        json inReqPayload = check inRequest.getJsonPayload();
        // Json payload format for an http out request
        json outReqPayload = {"Name":inReqPayload.Name, "ArrivalDate":inReqPayload.ArrivalDate, 
                            "DepartureDate":inReqPayload.DepartureDate, "Preference":""};

        // Reserve airline ticket for the user by calling Airline reservation service
        // construct the payload
        json outReqPayloadAirline = outReqPayload;
        outReqPayloadAirline.Preference = inReqPayload.Preference.Airline;

        // Send a post request to airlineReservationService with appropriate payload and get response
        http:Response inResAirline = check airlineReservationEP->post("/reserve", untaint outReqPayloadAirline);

        // Get the reservation status
        var airlineResPayload = check inResAirline.getJsonPayload();
        string airlineStatus = airlineResPayload.Status.toString();

        // Reserve hotel room for the user by calling Hotel reservation service
        // construct the payload
        json outReqPayloadHotel = outReqPayload;
        outReqPayloadHotel.Preference = inReqPayload.Preference.Accommodation;

        // Send a post request to hotelReservationService with appropriate payload and get response
        http:Response inResHotel = check hotelReservationEP->post("/reserve", untaint outReqPayloadHotel);

        // Get the reservation status
        var hotelResPayload = check inResHotel.getJsonPayload();
        string hotelStatus = hotelResPayload.Status.toString();

        // Renting car for the user by calling Car rental service
        // construct the payload
        json outReqPayloadCar = outReqPayload;
        outReqPayloadCar.Preference = inReqPayload.Preference.Car;

        // Send a post request to carRentalService with appropriate payload and get response
        http:Response inResCar = check carRentalEP->post("/rent", untaint outReqPayloadCar);

        // Get the rental status
        var carResPayload = check inResCar.getJsonPayload();
        string carRentalStatus = carResPayload.Status.toString();

        // If all three services response positive status, send a successful message to the user
        http:Response outResponse = new;
        outResponse.setJsonPayload({"Message":"Congratulations! Your journey is ready!!"});
        _ = client->respond(outResponse);
    }
}