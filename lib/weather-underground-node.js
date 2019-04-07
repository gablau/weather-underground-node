/* eslint-disable no-console */
var request = require("request");
var util = require("util");

var WeatherUndergroundNode = function(apikey, imperial, debug) {
	"use strict";

	if(process.env.NODE_ENV === 'test') {
		var restore = console.log;
		console.log = function () {};
	}

	var that = this;

	that.chainedRequests = [];
	that.chainedParams = [];
	var format = "format=json";
	var units = "units=" + (imperial ? "e" : "m");
	apikey = "apiKey=" + apikey;
	if(debug !== true) debug = false;
    
	/* CONDITION */

	that.PWSCurrentContitions = function(stationId) {
		this.chainedRequests.push("/v2/pws/observations/current");
		this.chainedParams.push("stationId="+stationId);
		return this;
	};
    
	that.PWSDailySummary7Day = function(stationId) {
		this.chainedRequests.push("/v2/pws/dailysummary/7day");
		this.chainedParams.push("stationId="+stationId);
		return this;
	};
    
	that.PWSRecentHistory1Day = function(stationId) {
		this.chainedRequests.push("/v2/pws/observations/all/1day");
		this.chainedParams.push("stationId="+stationId);
		return this;
	};
    
	that.PWSRecentHistory7Day = function(stationId) {
		this.chainedRequests.push("/v2/pws/observations/hourly/7day");
		this.chainedParams.push("stationId="+stationId);
		return this;
	};
    
	/* HISTORY */
    
	that.PWSHistoryHourly = function(stationId, date) {
		this.chainedRequests.push("/v2/pws/history/hourly");
		this.chainedParams.push("stationId="+stationId);
		this.chainedParams.push("date="+date);
		return this;
	};
    
	that.PWSHistoryAll = function(stationId, date) {
		this.chainedRequests.push("/v2/pws/history/all");
		this.chainedParams.push("stationId="+stationId);
		this.chainedParams.push("date="+date);
		return this;
	};
    
	that.PWSHistoryDaily = function(stationId, date) {
		this.chainedRequests.push("/v2/pws/history/daily");
		this.chainedParams.push("stationId="+stationId);
		this.chainedParams.push("date="+date);
		return this;
	};
    
	/* FORECAST */
    
	that.ForecastDaily = function() {
		this.chainedRequests.push("/v3/wx/forecast/daily");
		return this;
	};
    
	that.ThreeDay = function() {
		this.chainedRequests.push("/3day");
		return this;
	};
	that.FiveDay = function() {
		this.chainedRequests.push("/5day");
		return this;
	};
	that.SevenDay = function() {
		this.chainedRequests.push("/7day");
		return this;
	};
	that.TenDay = function() {
		this.chainedRequests.push("/10day");
		return this;
	};
	that.fifteenDay = function() {
		this.chainedRequests.push("/15day");
		return this;
	};
    
	that.ByPostalCode = function(code, country) {
		this.chainedParams.push("postalKey="+code+":"+country);
		return this;
	};

	that.ByIataCode = function(code) {
		this.chainedParams.push("iataCode="+code);
		return this;
	};

	that.ByIcaoCode = function(code) {
		this.chainedParams.push("icaoCode="+code);
		return this;
	};

	that.ByPlaceID = function(code) {
		this.chainedParams.push("placeid="+code);
		return this;
	};

	that.ByGeocode = function(lat, lon) {
		this.chainedParams.push("geocode="+lat+","+lon);
		return this;
	};

	that.Language = function(lang) {
		this.chainedParams.push("language="+lang);
		return this;
	};
    
	/* LOCATION */

	//location Type: address, city, locality, locid, poi, pws, state

	that.LocationSearch = function(query, locationType) { 
		this.chainedRequests.push("/v3/location/search");
		this.chainedParams.push("query="+query);
		this.chainedParams.push("locationType="+locationType);
		return this;
	};

	that.CountryCode = function(code) {
		this.chainedParams.push("countryCode="+code);
		return this;
	};
    
	that.AdminDistrictCode = function(code) {
		this.chainedParams.push("adminDistrictCode="+code);
		return this;
	};
    
	that.LocationPoint = function() { 
		this.chainedRequests.push("/v3/location/point");
		return this;
	};
    
	that.ByLocID = function(code) {
		this.chainedParams.push("locid="+code);
		return this;
	};
    
	that.LocationNear = function(lat, lon, type) {  //type: pws, airport, ski
		this.chainedRequests.push("/v3/location/near");
		this.chainedParams.push("geocode="+lat+","+lon);
		this.chainedParams.push("product="+type);
		return this;
	};

	/**
     * Performs the actual request
     *
     * @param callback
     */
	that.request = function(callback){

		if (that.chainedRequests.length<=0){
			if(process.env.NODE_ENV === 'test') {
				console.log = restore;
			}
			throw "You must specify a resource to request first (e.g., .PWSCurrentContitions().req...)";
		}else if (!(callback instanceof Function)){
			if(process.env.NODE_ENV === 'test') {
				console.log = restore;
			}
			throw "Argument must be a function";
		}
        
		var chain = that.chainedRequests.join("").replace(/\/$/, ""); //chain and remova traling slash
        
		var otherParams = [units, format, apikey];
		if(chain.indexOf("v3/location") !== -1) otherParams = [format, apikey];
		var query = that.chainedParams.concat(otherParams);

		

		// Construct the url
		var url = "https://api.weather.com" + chain + "?"+ query.join("&");
		that.chainedRequests = [];
		if(debug) {
			console.log("#-------------------#");
			console.log("# Req: " + url);
		}

		// Request the url
		request(url, function (error, response, body) {
			if(debug) {
				console.log("# Err: " + error);
				console.log("# Res code: " + response.statusCode);
				//console.log("Res: " + util.inspect(response, { compact: true, depth: 5, breakLength: 80 }));
				console.log("# Body: " + body);
				console.log("#-------------------#\n");
			}
            
			var json = false;
			if (!error && response.statusCode === 200) {
				error = false;
				try {
					json = JSON.parse(body);
				} catch (err) {
					console.error("Exception caught in JSON.parse", body);
					error = err;
				}
			}
			else if(!error && response.statusCode > 200) {
				error = { 
					code: response.statusCode,
					msg: "",
				};
				switch(response.statusCode){
				case 204:
					error.msg="No Data Found for specific query.";
					break;
				case 400:
					error.msg="Bad request.";
					break;
				case 401:
					error.msg="Unauthorized. The request requires authentication.";
					break;
				case 403:
					error.msg="Forbidden.";
					break;
				case 404:
					error.msg="Not found. The endpoint requested is not found.";
					break;
				case 405:
					error.msg="Method Not Allowed.";
					break;
				case 406:
					error.msg="Not Acceptable.";
					break;
				case 408:
					error.msg="Request Timeout.";
					break;
				default:
					error.msg="Request Timeout.";
					break;
				}
			}
			if(debug) {
				console.log("# Error: " + util.inspect(error, { compact: true, depth: 5, breakLength: 80 }));
				console.log("# Response: " + util.inspect(json, { compact: true, depth: 5, breakLength: 80 }));
				console.log("#-------------------#\n");
			}
			if(process.env.NODE_ENV === 'test') {
				console.log = restore;
			}
			callback.call(that, error, json);
			return;
		});
	};
};

module.exports = WeatherUndergroundNode;
