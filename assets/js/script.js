let key = "a821b4d398ab3031604981a4408fdd33";
let cityname = "london";

// Instructions from website documentation
//=====================================
//Call 5 day / 3 hour forecast data
//You can search weather forecast for 5 days with data every 3 hours by geographic coordinates.
// "lat": 51.5156177,
// "lon": -0.0919983,
//to get location = https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// to get forecast = https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

let queryURL1 = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${key}`;

var fetchCoordinates = fetch(queryURL1)
  .then(function (response) {
    return response.json();
  })
  // After data comes back from the request
  .then(function (data) {
    // console.log(queryURL1);
    // console.log(data[0]);
    var lat = data[0].lat;
    var lon = data[0].lon;
    // console.log(lat, lon);

    let queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

    var fetchforecast = fetch(queryURL2)
      .then(function (response) {
        return response.json();
      })
      // After data comes back from the request
      .then(function (data) {
        console.log(data);
        console.log(data.list);
      });
  });
