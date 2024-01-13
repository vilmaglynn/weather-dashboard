// Instructions from website documentation
//=====================================
//Call 5 day / 3 hour forecast data
//You can search weather forecast for 5 days with data every 3 hours by geographic coordinates.
// "lat": 51.5156177,
// "lon": -0.0919983,
//to get location = https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// to get forecast = https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//=====================================

let key = "a821b4d398ab3031604981a4408fdd33";
let cityname = "london";
let queryURL1 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${key}`;

//fetch #1 to get coordinates of lat and lon
var fetchCoordinates = fetch(queryURL1)
  .then(function (response) {
    return response.json();
  })
  // After data comes back from the request
  .then(function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;

    let queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;
    //fetch #2 to get the forecast
    var fetchforecast = fetch(queryURL2)
      .then(function (response) {
        //response object
        //useful properties and methods
        //convert response into JSON data
        //return promise
        return response.json();
      })
      // After data comes back from the request
      .then(function (data) {
        console.log(data);
        console.log(data.list);
        //======================
        getWeatherData();
        function getWeatherData() {
          for (i = 0; i < data.list.length; i++) {
            let description = `${data.list[i].weather[0].description}`;
            let weatherDate = `${data.list[i].dt_txt}`;
            let temp = `Temp: ${data.list[i].main.temp}`;
            let wind = `Wind: ${data.list[i].wind.speed}`;
            let humidity = `Humidity: ${data.list[i].main.humidity}`;
            console.log(description, weatherDate, temp, wind, humidity);
          }
        }
        //======================
      });
  })
  .catch(function (error) {
    console.log(error);
  });
