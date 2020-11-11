let APIKey = "8375474e12a3c07e327029469afe5cd7";
let city = "Long Beach, CA, USA";
let weatherDiv = $(".weatherInfo");
let navDiv = $(".list-group-flush");
let fiveDay =$(".fiveDay");
let lat, lon = "";

$(document).ready(function(){
    $("#submit").on("click", function(event){
        event.preventDefault();
        city = $("#cityName").val();
        populate();
    })
  });
  
  function populate(){
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        weatherDiv.html("");
        var time = moment().format("MMM Do YYYY"); 
        lat = response.coord.lat;
        lon = response.coord.lon;
        weatherDiv.append(`<h1 class="mt-4">${response.name} (${time})<img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png"></h1>`);
        weatherDiv.append(`<p>Temperature: ${response.main.temp} °F</p><p>Humidity: ${response.main.humidity}</p><p>Wind Speed: ${response.wind.speed} MPH</p>`)
        navDiv.append(`<a href="#" class="list-group-item list-group-item-action bg-light" data-city="${response.name}">${response.name}</a>`);
        uvIndex();
        historic();
  })};

function uvIndex(){
  var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +"&appid=" + APIKey + "&units=imperial";
  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {
    let uvVal = response.value;
    let uvDisp = "badge badge-secondary";
    if(uvVal < 3){
      uvDisp = "badge badge-success";
    } else if (uvVal >= 3 && uvVal < 7){
      uvDisp = "badge badge-warning";
    } else {
      uvDisp = "badge badge-danger";
    }
    weatherDiv.append(`<p>UV Index: <span class="${uvDisp} p-2">${uvVal}</span></p>`)
})}

function historic(){
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial"
  $.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
  console.log(response);
  fiveDay.append(`<h2 class="mt-4">5-Day Forecast:</h2>`);
  
})
}
  
  populate();