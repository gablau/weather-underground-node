# Weather underground client for node.js
## NEW 2019 API from The Weather Company (IBM) only for PWS owners

The Weather Company (IBM), which acquired Weather Underground in 2012, withdrew the API Weather Underground in March 2019 (see: [End of Service for the Weather Underground API](https://web.archive.org/web/20200220003108/https://apicommunity.wunderground.com/weatherapi/topics/end-of-service-for-the-weather-underground-api) last update 20-02-2020 by [WaybackMachine](https://web.archive.org/))

But IBM itself has decided that the owners / contributors of Personal Weather Station (PWS) will continue to be eligible for a free replacement API service selected from our standard IBM/Weather Company standard offerings that contain:
 
- Current observations from the PWS network
- 5 day daily forecast
- PWS historical data
- PWS lookup by geocode, zip code and location
- Call volume: 1500/day, 30/minute

(see: [Weather Underground API update](https://web.archive.org/web/20190420102857/https://apicommunity.wunderground.com/weatherapi/topics/weather-underground-api-update) last update 20-04-2020 by [WaybackMachine](https://web.archive.org/))

From Friday, March 22, 2019, IBM  will begin turning off the keys associated with personal weather stations (PWSs) on the old Weather Underground API `http://api.wunderground.com/api/`.

In order to use the new API made available by the Wheater company (IBM) accessible from the new endpoint `https://api.weather.com` you need to get the new api key. Go to [WU - Personal Weather Station Network](https://www.wunderground.com/pws/overview) login/register and then to [API Keys](https://www.wunderground.com/member/api-keys)

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
```js    
    wunderground.[resource call(s)].request(function (err, response) {
                console.log(response);
        }););
```    
or with sync method     
```js
    const result = await wunderground.[resource call(s)].requestSync();
```    
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

So to get the current conditions you would use the following code, where `IROME7475` is a PWS station ID:

```js
wunderground.PWSCurrentConditions("IROME7475").request(function (err, response) {
    console.log(response);
});
```

To get 5 day forecast by postal code:

```js
wunderground.ForecastDaily().FiveDay().ByPostalCode("00178", "IT").Language("en-EN").request(function (err, response) {
        console.log(response);
});
```

To get 5 day forecast by geocode wit Italian language:

```js
wunderground.ForecastDaily().FiveDay().ByGeocode("41.89", "12.444").Language("it-IT").request(function (err, response) {(function (err, response) {
        console.log(response);
});
```
To get daily historic data:

```js
wunderground.PWSHistoryDaily("IROME7475", "20190309").request(function (err, response) {
        console.log(response);
});
```

## Units
Imperial/english units can be requested by adding `InImperialUnits()` or `InEnglishUnits()` to the chain. (default: Metric units)

## Running Unit Tests and Code coverage

In order to run unit tests you need to include your apykey and your PWS station id in .env file and set in the root directory.
```bash
NODE_ENV=test
WU_APY_KEY=B5792DB9271ED8697F671F8FBBE49E43
WU_STATION_ID=YOUR_STATION_ID_HERE
```

Then simply run test this command: ```npm run test```

For code coverage run this command: ```npm run coverage```

## License
This project is released under The MIT License (MIT)
