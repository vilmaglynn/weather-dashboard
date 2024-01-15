$(document).ready(function () {
  // Load previous cities from local storage
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  displayCities(savedCities);

  // Handle form submission
  $("#search-form").submit(function (event) {
    event.preventDefault();

    const cityname = $("#search-input").val();
    const key = "a821b4d398ab3031604981a4408fdd33";
    const queryURL1 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${key}`;

    fetch(queryURL1)
      .then((response) => response.json())
      .then((data) => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const country = data[0].country;
        console.log(data);

        const queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;
        // Fetch #2 to get the forecast
        fetch(queryURL2)
          .then((response) => response.json())
          .then((data) => {
            // Function to organize and display weather forecast by day
            function displayWeatherData() {
              const forecastContainer = $("#weatherForecast");

              // Group data by day
              const groupedByDay = {};
              data.list.forEach((forecast) => {
                // Extract the date part and format it
                const dayOfWeek = dayjs(forecast.dt_txt).format("dddd DD");

                // Check if the date is greater than today
                if (dayjs(forecast.dt_txt).isAfter(dayjs(), "day")) {
                  if (!groupedByDay[dayOfWeek]) {
                    groupedByDay[dayOfWeek] = forecast;
                  }
                }
              });

              // Create divs for each day
              for (const dayOfWeek in groupedByDay) {
                const dayContainer = $(
                  `<div class="day-container"><h3>${dayOfWeek}</h3></div>`
                );
                const forecast = groupedByDay[dayOfWeek];

                const imageUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
                const tempKelvin = forecast.main.temp;
                const tempC = `${Math.round(tempKelvin - 273.15)}°C`;

                // Append image and forecast details to hourlyForecastContainer
                dayContainer.append(
                  `<div><img src="${imageUrl}" alt="Weather Icon"><br> ${forecast.weather[0].description} <br>Temp: ${tempC} |<br> Wind: ${forecast.wind.speed} m/ph | <br>Humidity: ${forecast.main.humidity}%</div> <hr>`
                );

                // Append the day container to the main forecast container
                forecastContainer.append(dayContainer);
              }
            }

            //====================================
            // Display TODAY's description on screen
            // Use dayjs to get the current date and time
            const currentDate = dayjs().format("dddd DD MMM YYYY | HH:mm");
            // Display the formatted date and time on the screen
            const txt1 = $("<h2>").text(currentDate);
            $("#today").append(txt1);
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
            const wind = $("<p>").text(`Wind: ${data.list[0].wind.speed} m/ph`);
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

    // Clear old data
    $("#today").empty();
    $("#weatherForecast").empty();

    // Save city to local storage
    const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    savedCities.push(cityname);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));

    // Display city as a button on the screen
    displayCities(savedCities);

    // Clear input field
    $("#search-input").val("");
  });

  // Function to display cities as buttons on the screen
  function displayCities(cities) {
    const history = $("#history");
    history.empty(); // Clear existing list

    // Append each city as a button to the list
    cities.forEach(function (city, index) {
      const cityButton = $(
        '<button class="btn-secondary city-button"></button>'
      )
        .text(city)
        .attr("data-index", index);
      const deleteButton = $('<span class="deleteButton">Delete</span>');

      const listItem = $("<li></li>").append(cityButton).append(deleteButton);
      history.append(listItem);

      // Attach click event to each city button for deletion
      deleteButton.click(function () {
        deleteCity(index);
      });

      // Attach click event to each city button to grab the value
      // I KNOW - DRY!!!! Just couldnt figure out how to do with a function... :-( )
      cityButton.click(function () {
        const clickedCity = $(this).text();
        console.log("Clicked City:", clickedCity);
        // handle the clicked city value
        const key = "a821b4d398ab3031604981a4408fdd33";
        const queryURL1 = `https://api.openweathermap.org/geo/1.0/direct?q=${clickedCity}&limit=5&appid=${key}`;

        fetch(queryURL1)
          .then((response) => response.json())
          .then((data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const country = data[0].country;
            console.log(data);

            const queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;
            // Fetch #2 to get the forecast
            fetch(queryURL2)
              .then((response) => response.json())
              .then((data) => {
                // Function to organize and display weather forecast by day
                function displayWeatherData() {
                  const forecastContainer = $("#weatherForecast");

                  // Group data by day
                  const groupedByDay = {};
                  data.list.forEach((forecast) => {
                    // Extract the date part and format it
                    const dayOfWeek = dayjs(forecast.dt_txt).format("dddd DD");

                    // Check if the date is greater than today
                    if (dayjs(forecast.dt_txt).isAfter(dayjs(), "day")) {
                      if (!groupedByDay[dayOfWeek]) {
                        groupedByDay[dayOfWeek] = forecast;
                      }
                    }
                  });

                  // Create divs for each day
                  for (const dayOfWeek in groupedByDay) {
                    const dayContainer = $(
                      `<div class="day-container"><h3>${dayOfWeek}</h3></div>`
                    );
                    const forecast = groupedByDay[dayOfWeek];

                    const imageUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
                    const tempKelvin = forecast.main.temp;
                    const tempC = `${Math.round(tempKelvin - 273.15)}°C`;

                    // Append image and forecast details to hourlyForecastContainer
                    dayContainer.append(
                      `<div><img src="${imageUrl}" alt="Weather Icon"><br> ${forecast.weather[0].description} <br>Temp: ${tempC} |<br> Wind: ${forecast.wind.speed} m/ph | <br>Humidity: ${forecast.main.humidity}%</div> <hr>`
                    );

                    // Append the day container to the main forecast container
                    forecastContainer.append(dayContainer);
                  }
                }

                //====================================
                // Display TODAY's description on screen
                // Use dayjs to get the current date and time
                const currentDate = dayjs().format("dddd DD MMM YYYY | HH:mm");
                // Display the formatted date and time on the screen
                const txt1 = $("<h2>").text(currentDate);
                $("#today").append(txt1);
                const location = `${clickedCity}, ${country}`;
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
                const wind = $("<p>").text(
                  `Wind: ${data.list[0].wind.speed} m/ph`
                );
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

        // Clear old data
        $("#today").empty();
        $("#weatherForecast").empty();

        //============================
      });
    });
  }

  // Function to delete a city from the history list
  function deleteCity(index) {
    const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    savedCities.splice(index, 1);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    displayCities(savedCities);
  }
});
