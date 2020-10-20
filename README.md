# Weather underground client for node.js
## NEW 2019 API from The Weather Company (IBM) only for PWS owners

The Weather Company (IBM), which acquired Weather Underground in 2012, withdrew the API Weather Underground in March 2019 (see: [End of Service for the Weather Underground API](https://apicommunity.wunderground.com/weatherapi/topics/end-of-service-for-the-weather-underground-api))

But IBM itself has decided that the owners / contributors of Personal Weather Station (PWS) will continue to be eligible for a free replacement API service selected from our standard IBM/Weather Company standard offerings that contain:
 
- Current observations from the PWS network
- 5 day daily forecast
- PWS historical data
- PWS lookup by geocode, zip code and location
- Call volume: 1500/day, 30/minute

(see: [Weather Underground API update](https://apicommunity.wunderground.com/weatherapi/topics/weather-underground-api-update))

From Friday, March 22, 2019, IBM  will begin turning off the keys associated with personal weather stations (PWSs) on the old Weather Underground API `http://api.wunderground.com/api/`.

In order to use the new API made available by the Wheater company (IBM) accessible from the new endpoint `https://api.weather.com` you need to get the new keys to do so follow these instructions: [Turning off PWS-associated keys](https://apicommunity.wunderground.com/weatherapi/topics/turning-off-pws-associated-keys)

APIs for Personal Weather Station Contributors
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit


## Install
npm install --save weather-underground-node

```js
var WeatherUndergroundNode = require('weather-underground-node');
var myApyKey = 'B5792DB9271ED8697F671F8FBBE49E43';
var wunderground = new WeatherUndergroundNode(myApyKey);
```

## How To Use
The syntax follows a simple pattern:
    
    wunderground.[resource calls(s)].request(callback);
    
The available resource calls are the following (you must include one in your request):

- PWSCurrentConditions
- PWSDailySummary7Day
- PWSRecentHistory1Day
- PWSRecentHistory7Day

- PWSHistoryHourly
- PWSHistoryAll
- PWSHistoryDaily

- ForecastDaily

- LocationSearch
- LocationPoint
- LocationNear

The documentation for each resource can be found here: [APIs documentation for PWS Contributors](https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit).

So to get the current conditions you would use the following code, where `IROME288` is a PWS station ID:

```js
wunderground.PWSCurrentConditions("IROME228").request(function (err, response) {
    console.log(response);
}
```

To get 5 day forecast by postal code:

```js
wunderground.ForecastDaily().FiveDay().ByPostalCode("00178", "IT").Language("en-EN").request(function (err, response) {
        console.log(response);
}
```

To get 5 day forecast by geocode wit Italian language:

```js
wunderground.ForecastDaily().FiveDay().ByGeocode("41.860", "12.470").Language("it-IT").request(function (err, response) {(function (err, response) {
        console.log(response);
}
```
To get daily historic data:

```js
wunderground.PWSHistoryDaily("IROME228", "20190309").request(function (err, response) {                 console.log(response);
}
```

## Running Unit Tests and Code coverage

In order to run unit tests you need to include your apykey in .env file in the root directory.

Then simply run test this command: ```npm run test```

For code coverage run this command: ```npm run coverage```

## License
This project is released under The MIT License (MIT)
