var APIKey = "8375474e12a3c07e327029469afe5cd7";
var city = "Long Beach, CA, USA";
var weatherDiv = $(".weatherInfo");

$(document).ready(function(){
    $("#submit").on("click", function(event){
        event.preventDefault();
        city = $("#cityName").val();
        populate();
    })
  });
  
  function populate(){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response.weather[0].icon);
        var time = moment().format("MMM Do YYYY"); 
        weatherDiv.append(`<h1 class="mt-4">${response.name} (${time})<img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png"></h1>`);
  })};
   
  populate();