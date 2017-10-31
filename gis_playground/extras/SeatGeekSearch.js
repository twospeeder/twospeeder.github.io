define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/request"
], function(declare, lang, esriRequest){

    declare(null, {
        distance: null,
        lastSearchResult: null,
        perPage: null,
        queryParams: null,
        seatGeekUrl: null,

        constructor: function(options) {
            //class defaults
            //default range is 20 miles
            this.distance = options.distance || "20mi";
            //50 results per page
            this.perPage = options.perPage || 50;
            this.seatGeekUrl = "http://api.seatgeek.com/2/events";

            //returnEvents is called by esriRequest
            this.returnEvents = lang.hitch(this, this.returnEvents);
        },

        searchByLoc: function(geopoint) {
            var eventsResponse;

            this.queryParams = {
                "lat": geopoint.y,
                "lon": geopoint.x,
                "page": 1,
                "per_page": this.perPage,
                "range": this.distance
            };

            //test endpoint - petco park
            //http://api.seatgeek.com/2/events?lat=32.7078&lon=-117.157&range=20mi&callback=c
            eventsResponse = esriRequest({
                "url": this.seatGeekUrl,
                "callbackParamName": "callback",
                "content": this.queryParams
            });
            return eventsResponse.then(this.returnEvents, this.err);
        },

        getMore: function() {
            var eventsResponse;

            //increment the page number
            this.queryParams.page++;

            eventsResponse = esriRequest({
                "url": this.seatGeekUrl,
                "callbackParamName": "callback",
                "content": this.queryParams
            });
            return eventsResponse.then(this.returnEvents, this.err);
        },

        returnEvents: function(response) {
            if (response.meta.total === 0) {
                return null;
            }

            this.lastSearchResult = response;
            return response;
        },

        err: function(err) {
            console.log("Failed to get results due to error: ", err)
        }
    });
});