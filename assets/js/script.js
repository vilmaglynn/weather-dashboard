const key = "a821b4d398ab3031604981a4408fdd33";
const cityname = "brighton";
const queryURL1 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${key}`;

//fetch #1 to get coordinates of lat and lon
fetch(queryURL1)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const lat = data[0].lat;
    const lon = data[0].lon;
    const country = data[0].country;

    const queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;
    //fetch #2 to get the forecast
    fetch(queryURL2)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.list);

        // Function to organize and display weather forecast by day
        function displayWeatherData() {
          const forecastContainer = $("#weatherForecast");

          // Group data by day
          const groupedByDay = {};
          data.list.forEach((forecast) => {
            const day = forecast.dt_txt.split(" ")[0]; // Extracting the date part
            if (!groupedByDay[day]) {
              groupedByDay[day] = [];
            }
            groupedByDay[day].push(forecast);
          });

          // Create divs for each day
          for (const day in groupedByDay) {
            const dayContainer = $(
              `<div class="day-container"><h3>${day}</h3></div>`
            );
            const hourlyForecastContainer = $('<div class="hourly-forecast">');

            // Add hourly forecast for the day
            groupedByDay[day].forEach((forecast) => {
              const imageUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
              const tempKelvin = forecast.main.temp;
              const tempC = `${Math.round(tempKelvin - 273.15)}°C`;

              // Append image and forecast details to hourlyForecastContainer
              hourlyForecastContainer.append(
                `<div><img src="${imageUrl}" alt="Weather Icon"> ${
                  forecast.dt_txt.split(" ")[1]
                } <br>Temp: ${tempC} | Wind: ${
                  forecast.wind.speed
                } m/s | Humidity: ${forecast.main.humidity}%</div> <hr>`
              );
            });

            // Append the hourly forecast container to the day container
            dayContainer.append(hourlyForecastContainer);

            // Append the day container to the main forecast container
            forecastContainer.append(dayContainer);
          }
        }

        // display TODAY's description on screen
        const location = `${cityname}, ${country}`;
        const locationParagraph = $("<h2>").text(location);
        const description0 = $("<span>").text(
          data.list[0].weather[0].description
        );
        $("#today").append(locationParagraph, description0);

        // Function to add an image to the screen
        const imageUrl = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
        const image = $("<img>")
          .attr("src", imageUrl)
          .attr("alt", "Weather Icon");
        $("#today").append(image, "<hr>");

        // Display additional weather information (temp, wind, humidity)
        const tempKelvin = data.list[0].main.temp;
        const tempC = $("<p>").text(
          `Temp: ${Math.round(tempKelvin - 273.15)}°C`
        );
        const wind = $("<p>").text(`Wind: ${data.list[0].wind.speed} m/s`);
        const humidity = $("<p>").text(
          `Humidity: ${data.list[0].main.humidity}%`
        );
        $("#today").append(tempC, wind, humidity);

        // Call the function to display weather forecast by day
        displayWeatherData();
      });
  })
  .catch((error) => {
    console.log(error);
  });

// Get current date/time to display on the website main area
function displayDateTime() {
  // Use dayjs to get the current date and time
  const currentDate = dayjs();
  // Format the date and time as a string
  const formattedDateTime = currentDate.format("ddd DD MMM YYYY | HH:mm");
  console.log(formattedDateTime);
  // Display the formatted date and time on the screen
  const txt1 = $("<h2>").text(formattedDateTime);
  $("#today").append(txt1);
}

// Call the function when the document is ready
$(document).ready(function () {
  displayDateTime();
});
