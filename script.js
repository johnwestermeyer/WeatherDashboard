let APIKey = config.MY_KEY;
let city = "Long Beach, California";
let weatherDiv = $(".weatherInfo");
let navDiv = $(".list-group-flush");
let fiveDay = $(".card-group");
let lat, lon = "";
let citySave = [];

//if no local storage, default to Long Beach
if(localStorage.getItem("weather") === null){ 
  city = "Long Beach, California";
  populate();
} else{ 
  //If there is local storage populate to side nav and load most recent city
  citySave = JSON.parse(localStorage.getItem("weather"));
  city = citySave[citySave.length - 1];
  citySave.forEach(e => {    
    let name = e.split(",")
    navDiv.append(`<a href="#" class="list-group-item list-group-item-action bg-light" data-city="${e}">${name[0]}</a>`);
  })  
  populate();
}

//pulls up entered city weather
$(document).ready(function(){
    $("#submit").on("click", function(event){
        event.preventDefault();
        city = $("#cityName").val();
        populate();
    })
  });

//pulls up previous entered city weather
$(".list-group-flush").on("click", "a", function(event){
    event.preventDefault();      
    city = $(this).data("city");
    populate();
  });

//populates the main container with weather info
  function populate(){
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        weatherDiv.html("");
        let time = moment().format("MMM Do YYYY"); 
        lat = response.coord.lat;
        lon = response.coord.lon;
        weatherDiv.append(`<h1 class="mt-4">${response.name} (${time})<img src="https://openweathermap.org/img/w/${response.weather[0].icon}.png"></h1>`);
        weatherDiv.append(`<p>Temperature: ${response.main.temp}°F</p><p>Humidity: ${response.main.humidity}</p><p>Wind Speed: ${response.wind.speed} MPH</p>`);
        let historyLinks = document.querySelectorAll("a");
        let history = false;
        for(let i = 0; i < historyLinks.length; i++){
            if(historyLinks[i].dataset.city === city){
              history = true;            
          }
        }
        if(!history){          
          navDiv.append(`<a href="#" class="list-group-item list-group-item-action bg-light" data-city="${city}">${response.name}</a>`);
          handleStorage();
        }
        uvIndex();
        historic();
  })};

//checks for UV Index value and assigns css code based on severity
function uvIndex(){
  let queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +"&appid=" + APIKey + "&units=imperial";
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
    weatherDiv.append(`<p>UV Index: <span class="${uvDisp} p-2">${uvVal}</span></p>`);
})}

//populates the 5-day forecast
function historic(){
  let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&cnt=6&appid="+ APIKey + "&units=imperial";
  $.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
  fiveDay.html("");
  for(let i = 1; i < 6; i++){
    let histDate = moment.unix(response.daily[i].dt).format("MM/DD/YYYY");
    fiveDay.append(`<div class="card text-white bg-primary mr-2" style="max-width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${histDate}</h5>
      <img src="https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png">
      <p class="card-text">Temp: ${response.daily[i].temp.day}°F</p>
      <p class="card-text">Humidity: ${response.daily[i].humidity}</p>
    </div>
  </div>`)
  }
})
}

//localStorage creation and management
function handleStorage(){
  if(localStorage.getItem("weather") === null){
    localStorage.setItem("weather", JSON.stringify([city]));
  } else{
    let citySave = JSON.parse(localStorage.getItem("weather"));
    citySave[citySave.length] = city;
    localStorage.setItem("weather", JSON.stringify(citySave));
  }
}

