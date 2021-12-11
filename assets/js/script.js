var cityInputEl = $("#city-name");
var stateInputEl = $("#state-name");
var formEl = $("#search-form");

var getLatLong = function(){
    event.preventDefault();
    var cityInput = cityInputEl.val();
    var stateInput = stateInputEl.val();

    var geoUrl = "https://us1.locationiq.com/v1/search.php?key=pk.f5879e36cb8cd7ffbfd086d6d53771e8&q=" + cityInput +"," + stateInput +"&format=json";
    console.log(geoUrl);
    fetch(geoUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            if(data[0].osm_type === "relation"){
                getWeather(data[0].lat, data[0].lon);
            }
            
        })
}
var getWeather = function(lat, lon){
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=7e4d33d6e04a9c74c31006850d9f58bf&units=imperial";
    fetch(weatherUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
        })

}
formEl.on('submit', getLatLong);
