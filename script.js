var APIKey = "8375474e12a3c07e327029469afe5cd7";
var city = "";

$(document).ready(function(){
    $(".submit").on("click", function(event){
        event.preventDefault();
        city = $(".city").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {
            console.log(response);
    })
  });})
    
   