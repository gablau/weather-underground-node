/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require("should");
var WeatherUndergroundNode = require("./../lib/weather-underground-node");

describe("Testing Weather Underground Node:", function () {
	"use strict";

	this.slow(500);
	this.timeout(4000);
	var apikey = process.env.WU_APY_KEY;
	var apykeyMessage = "Invalid apikey / You must save your own apikey in .env file to run test";
	var validApikey = false;

	var weekDayIT = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
	var weekDayEN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	it("API KEY check.", function (done) {

		apikey.should.match(/^[a-fA-F0-9]{32}$/);
		should.notEqual(apikey, "B5792DB9271ED8697F671F8FBBE49E43", apykeyMessage);
		validApikey = true;
		done();
	});

	it("Request - Missing callback.", function(done){

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey+"xxxxx");
		should.throws(function () {
			wunderground.PWSCurrentConditions("IROME228").request("");
		}, /Argument must be a function/);
		done();	
	});

	it("Request - Wrong chain.", function(done){

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey+"xxxxx");
		should.throws(function () {
			wunderground.request("");
		}, /You must specify a resource to request first \(e.g., .PWSCurrentConditions\(\).req...\)/);
		done();	
	});
	
	it("Request PWS conditions.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions("IROME228").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
			response.observations[0].stationID.should.be.exactly("IROME228");
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - with debug.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey, true);
		wunderground.PWSCurrentConditions("IROME228").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
			response.observations[0].stationID.should.be.exactly("IROME228");
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - in imperial units.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions("IROME228").InImperialUnits().request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "imperial"]);
			response.observations[0].stationID.should.be.exactly("IROME228");
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - in english units.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions("IROME228").InEnglishUnits().request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "imperial"]);
			response.observations[0].stationID.should.be.exactly("IROME228");
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - in metric units.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions("IROME228").InMetricUnits().request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.is.Array();
			response.observations[0].should.have.properties(["stationID", "softwareType", "country", "lat", "lon", "metric"]);
			response.observations[0].stationID.should.be.exactly("IROME228");
			response.observations[0].country.should.be.exactly("IT");
			response.observations[0].softwareType.should.be.exactly("NodeRed");
			done();
		});

	});

	it("Request PWS conditions - wrong key.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey + "xxxxx");
		wunderground.PWSCurrentConditions("IROME228").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request PWS conditions, missing PWS.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSCurrentConditions("IROME228aaaaaa").request(function (err, response) {
			response.should.not.have.property("observations");
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(204);
			err.msg.should.be.exactly("No Data Found for specific query.");
			done();
		});

	});

	it("Request PWS daily summary - 7 day.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSDailySummary7Day("IROME228").request(function (err, response) {
			response.should.have.property("summaries");
			response.summaries.should.be.Array();
			response.summaries.length.should.be.exactly(7);
			done();
		});

	});

	it("Request PWS recent history - 1 day.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSRecentHistory1Day("IROME228").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS recent history - 7 day.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSRecentHistory7Day("IROME228").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS history - Hourly.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSHistoryHourly("IROME228", "20190309").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.be.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS history - All.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSHistoryAll("IROME228", "20190309").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.be.greaterThan(0);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request PWS history - Daily.", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.PWSHistoryDaily("IROME228", "20190309").request(function (err, response) {
			response.should.have.property("observations");
			response.observations.should.be.Array();
			response.observations.length.should.be.exactly(1);
			response.observations[0].should.have.property("stationID");
			done();
		});

	});

	it("Request Forecast 5 day by Postal code", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPostalCode("00178", "IT").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by Postal code, wrong postal code", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPostalCode("00100", "IT").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(404);
			err.msg.should.be.exactly("Not found. The endpoint requested is not found.");
			done();
		});

	});

	it("Request Forecast 5 day by Postal code with different language", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPostalCode("00178", "IT").Language("it-IT").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayIT);
			done();
		});

	});

	it("Request Forecast 5 day by Geocode", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByGeocode("41.843", "12.666").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by Geocode - Wrong data", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByGeocode("4444", "5555").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(400);
			err.msg.should.be.exactly("Bad request.");
			done();
		});

	});

	it("Request Forecast 5 day by IATA code", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByIataCode("FCO").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by IATA code - Wrong data", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByIataCode("xxxx").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(404);
			err.msg.should.be.exactly("Not found. The endpoint requested is not found.");
			done();
		});

	});

	it("Request Forecast 5 day by ICAO code", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByIcaoCode("LIRF").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 5 day by Place ID", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().FiveDay().ByPlaceID("327145917e06d09373dd2760425a88622a62d248fd97550eb4883737d8d1173b").Language("en-EN").request(function (err, response) {
			response.should.have.properties("dayOfWeek", "narrative", "temperatureMax", "temperatureMin");
			response.dayOfWeek.should.be.Array();
			response.dayOfWeek.length.should.be.exactly(6);
			response.dayOfWeek[0].should.be.equalOneOf(weekDayEN);
			done();
		});

	});

	it("Request Forecast 3 day - Unauthorized", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().ThreeDay().ByGeocode("41.843", "12.666").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request Forecast 7 day - Unauthorized", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().SevenDay().ByGeocode("41.843", "12.666").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request Forecast 10 day - Unauthorized", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().TenDay().ByGeocode("41.843", "12.666").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});
	});

	it("Request Forecast 15 day - Unauthorized", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.ForecastDaily().fifteenDay().ByGeocode("41.843", "12.666").Language("en-EN").request(function (err, response) {
			err.should.have.properties(["code", "msg"]);
			err.code.should.be.exactly(401);
			err.msg.should.be.exactly("Unauthorized. The request requires authentication.");
			done();
		});

	});

	it("Request Location search by address", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("corso", "address").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(2);
			done();
		});

	});

	it("Request Location search by address and country", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("corso", "address").CountryCode("IT").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(2);
			done();
		});

	});

	it("Request Location search by PWS and country", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("IROME228", "pws").CountryCode("IT").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.exactly(1);
			done();
		});

	});

	it("Request Location search by address ", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("Lincoln Memorial Circle SW", "address").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(0);
			done();
		});

	});

	it("Request Location search by address and country and district", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationSearch("Lincoln Memorial Circle SW", "address").CountryCode("US").AdminDistrictCode("DC").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("address", "city", "country", "placeId");
			response.location.address.should.be.Array();
			response.location.address.length.should.be.greaterThan(0);
			done();
		});

	});


	it("Request Location point by Geocode", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationPoint().ByGeocode("41.943", "12.366").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("latitude", "longitude", "city", "country", "placeId");
			done();
		});

	});

	it("Request Location point by LocId", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey, true);
		wunderground.LocationPoint().ByLocID("USWY0183:1:US").Language("en-EN").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("latitude", "longitude", "city", "country", "placeId");
			done();
		});

	});

	it("Request Location near by Geocode", function (done) {

		validApikey.should.be.true(apykeyMessage);
		var wunderground = new WeatherUndergroundNode(apikey);
		wunderground.LocationNear("41.943", "12.366", "pws").request(function (err, response) {
			response.should.have.property("location");
			response.location.should.have.properties("latitude", "longitude", "stationName", "stationId");
			done();
		});

	});

});