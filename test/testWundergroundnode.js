/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require("should");
var fetch = require("node-fetch");
var nock = require("nock");
var fetch = require("node-fetch");

var WeatherUndergroundNode = require("./../lib/weather-underground-node");

describe("Testing Weather Underground Node:", function () {
	"use strict";

	this.slow(500);
	this.timeout(4000);
	var apikey = process.env.WU_APY_KEY;
	var PWSStationId = process.env.WU_STATION_ID;
	var apykeyMessage = "Invalid apikey / You must save your own apikey in .env file to run test";
	var pwsMessage = "Invalid PWS Station ID / You must save your PWS Station ID in .env file to run test";
	var validApikey = false;
	var validPws = false;
	var SampleAddress = "Lincoln Memorial Circle SW";
	var SampleLat = "41.894";
	var SampleLon = "12.444";

	var weekDayIT = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
	var weekDayEN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	it("API KEY check.", (done) => {

		apikey.should.match(/^[a-fA-F0-9]{32}$/);
		should.notEqual(apikey, "B5792DB9271ED8697F671F8FBBE49E43", apykeyMessage);
		validApikey = true;
		done();
	});

	it("PWS Station ID check.", (done) => {

		PWSStationId.should.not.be.null()
		PWSStationId.should.not.be.empty()
		var  url="https://www.wunderground.com/dashboard/pws/"+PWSStationId;
		fetch(url)
		  .then(response => {
				if(response.status !== 404) {
					validPws = true;
				}
			})
		  .catch((err) => {
				validPws = false;
			})
		  .finally(() => {
				done();
		  });
		
	});

	it("Request - Missing callback.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey+"xxxxx");
		should.throws(function () {
			wunderground.PWSCurrentConditions(PWSStationId).request("");
		}, /Argument must be a function/);
		done();	
	});

	it("Request - Wrong chain.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey+"xxxxx");
		should.throws(function () {
			wunderground.request("");
		}, /You must specify a resource to request first \(e.g., .PWSCurrentConditions\(\).req...\)/);
		done();	
	});

	
	
	it("Request PWS conditions.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
			response.observations[0].stationID.should.be.exactly(PWSStationId);
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions. SYNC", async () => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		const response = await  wunderground.PWSCurrentConditions(PWSStationId).requestSync();
		response.should.have.property("observations");
		response.observations.should.is.Array();
		response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
		response.observations[0].stationID.should.be.exactly(PWSStationId);
		response.observations[0].country.should.be.exactly("IT");
		response.observations[0].softwareType.should.be.exactly("NodeRed");
	});

	it("Request PWS conditions - with debug.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey, true);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
			response.observations[0].stationID.should.be.exactly(PWSStationId);
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - in imperial units.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).InImperialUnits().request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "imperial"]);
			response.observations[0].stationID.should.be.exactly(PWSStationId);
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - in english units.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).InEnglishUnits().request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "imperial"]);
			response.observations[0].stationID.should.be.exactly(PWSStationId);
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - in metric units.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).InMetricUnits().request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
			response.observations[0].stationID.should.be.exactly(PWSStationId);
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - wrong key.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey + "xxxxx");
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request PWS conditions, missing PWS.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId+"aaaaaa").request(function (err, response) {
			response.should.not.have.property("observations");
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(204);
			err.msg.should.be.exactly("No Data Found for specific query.");
			done();
		});

	});

	it("Request PWS conditions, SYNC missing PWS.", async () => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		const err = await  wunderground.PWSCurrentConditions(PWSStationId+"aaaaaa").requestSync();
		err.should.not.have.property("observations");
		err.should.have.properties(["code", "msg"]);
		err.code.should.be.exactly(204);
		err.msg.should.be.exactly("No Data Found for specific query.");
	});

	it("Request PWS daily summary - 7 day.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSDailySummary7Day(PWSStationId).request(function (err, response) {
			response.should.have.property("summaries");
			response.summaries.should.be.Array();
			response.summaries.length.should.be.exactly(7);
			done();
		});

	});

	it("Request PWS recent history - 1 day.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSRecentHistory1Day(PWSStationId).request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS recent history - 7 day.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSRecentHistory7Day(PWSStationId).request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS history - Hourly.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSHistoryHourly(PWSStationId, "20190309").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.be.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS history - All.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSHistoryAll(PWSStationId, "20190309").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.be.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS history - Daily.", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSHistoryDaily(PWSStationId, "20190309").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.be.exactly(1);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request Forecast 5 day by Postal code", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPostalCode("00178", "IT").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by Postal code, wrong postal code", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPostalCode("00100", "IT").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(404);
			err.msg.should.be.exactly("Not found. The endpoint requested is not found.");
			done();
		});

	});

	it("Request Forecast 5 day by Postal code with different language", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPostalCode("00178", "IT").Language("it-IT").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayIT);
			done();
		});

	});

	it("Request Forecast 5 day by Geocode", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByGeocode(SampleLat, SampleLon).Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by Geocode - Wrong data", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByGeocode("4444", "5555").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(400);
			err.msg.should.be.exactly("Bad request.");
			done();
		});

	});

	it("Request Forecast 5 day by IATA code", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByIataCode("FCO").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by IATA code - Wrong data", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByIataCode("xxxx").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(404);
			err.msg.should.be.exactly("Not found. The endpoint requested is not found.");
			done();
		});

	});

	it("Request Forecast 5 day by ICAO code", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByIcaoCode("LIRF").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by Place ID", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPlaceID("327145917e06d09373dd2760425a88622a62d248fd97550eb4883737d8d1173b").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 3 day - Unauthorized", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().ThreeDay().ByGeocode(SampleLat, SampleLon).Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request Forecast 7 day - Unauthorized", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().SevenDay().ByGeocode(SampleLat, SampleLon).Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request Forecast 10 day - Unauthorized", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().TenDay().ByGeocode(SampleLat, SampleLon).Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});
	});

	it("Request Forecast 15 day - Unauthorized", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().fifteenDay().ByGeocode(SampleLat, SampleLon).Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request Location search by address", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("corso", "address").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(2);
			done();
		});

	});

	it("Request Location search by address and country", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("corso", "address").CountryCode("IT").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(2);
			done();
		});

	});

	it("Request Location search by PWS and country", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch(PWSStationId, "pws").CountryCode("IT").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.exactly(1);
			done();
		});

	});

	it("Request Location search by address ", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch(SampleAddress, "address").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(0);
			done();
		});

	});

	it("Request Location search by address and country and district", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch(SampleAddress, "address").CountryCode("US").AdminDistrictCode("DC").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(0);
			done();
		});

	});


	it("Request Location point by Geocode", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationPoint().ByGeocode(SampleLat, SampleLon).Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("latitude", "longitude", "city", "country", "placeId");
			done();
		});

	});

	it("Request Location point by LocId", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey, true);
		wunderground.LocationPoint().ByLocID("USWY0183:1:US").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("latitude", "longitude", "city", "country", "placeId");
			done();
		});

	});

	it("Request Location near by Geocode", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationNear(SampleLat, SampleLon, "pws").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("latitude", "longitude", "stationName", "stationId");
			done();
		});

	});

	it("Request PWS conditions + HTTP error 403", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		
		var scope = nock("https://api.weather.com")
						.filteringPath((path) => {return "/";})
						.get("/").reply(403,"");

		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(403);
			err.msg.should.be.exactly("Forbidden.");
			done();
		});

	});
	

	it("Request PWS conditions + HTTP error 405", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		
		var scope = nock("https://api.weather.com")
						.filteringPath((path) => {return "/";})
						.get("/").reply(405,"");

		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(405);
			err.msg.should.be.exactly("Method Not Allowed.");
			done();
		});

	});

	it("Request PWS conditions + HTTP error 406", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);
		
		var scope = nock("https://api.weather.com")
						.filteringPath((path) => {return "/";})
						.get("/").reply(406,"");

		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(406);
			err.msg.should.be.exactly("Not Acceptable.");
			done();
		});

	});

	it("Request PWS conditions + HTTP error 408", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);

		var scope = nock("https://api.weather.com")
						.filteringPath((path) => {return "/"})
						.get("/").reply(408,"{}");

		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(408);
			err.msg.should.be.exactly("Request Timeout.");
			done();
		});

	});
	
	it("Request PWS conditions + HTTP error 410", (done) => {

		validApikey.should.be.true(apykeyMessage);
		validPws.should.be.true(pwsMessage);

		var scope = nock("https://api.weather.com")
						.filteringPath((path) => {return "/"})
						.get("/").reply(410,"");

		var wunderground = new WeatherUndergroundNode(apikey, true);
		wunderground.PWSCurrentConditions(PWSStationId).request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(410);
			err.msg.should.be.exactly("Request Timeout.");
			done();
		});

	});
	
});