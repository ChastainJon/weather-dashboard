var cityInputEl = $("#city-name");
var stateInputEl = $("#state-name");
var currentWeatherEl = $("#current");
var fiveDayEl = $("#fiveday");
var formEl = $("#search-form");
var historyEl = $("#history");

var recentCities = [];
var counter = 0;

var getLatLong = function(){
    event.preventDefault();
    var cityInput = cityInputEl.val();
    var stateInput = stateInputEl.val();

    if(!cityInput || !stateInput){
        alert("You need to complete the form");
        return;
    }

    var geoUrl = "https://us1.locationiq.com/v1/search.php?key=pk.f5879e36cb8cd7ffbfd086d6d53771e8&q=" + cityInput +"," + stateInput +"&format=json";
    fetch(geoUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            if(data[0].osm_type === "relation"){
                var cityState = {
                    "lat" : data[0].lat,
                    "long" : data[0].lon
                }
                recentCities.push(cityState);
            
                //add buttons for recent cities
                var recentCity = $('<button>');
                recentCity.addClass("btn btn-secondary w-100 mb-3");
                recentCity.attr("type", "submit");
                recentCity.attr("id", counter);
                console.log(recentCities[counter]);
                counter++;
                recentCity.text(cityInput+", "+ stateInput);
                historyEl.append(recentCity);
                getWeather(data[0].lat, data[0].lon);

            }
            
            
        })
}
var getWeather = function(lat, lon){
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=7e4d33d6e04a9c74c31006850d9f58bf&units=imperial";
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon="+ lon +"&appid=7e4d33d6e04a9c74c31006850d9f58bf&units=imperial";
    fetch(currentUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //clear div if already populated
            $("#current").empty();
            //H2 for current Div
            var cityDateEl = $('<h2>');
            cityDateEl.attr("class", "fw-bolder")
            var date = new Date(data.dt*1000);
            var year = new Date(data.dt*1000).getUTCFullYear();
            var day = new Date(data.dt*1000).getUTCDate();
            var month = new Date(data.dt*1000).getUTCMonth() + 1;
            cityDateEl.text(data.name + "(" + month + "/" + day + "/" + year + ")");

            //image after h2 element
            var weatherIconUrl = "https://openweathermap.org/img/wn/"
            var icon = data.weather[0].icon + ".png";
            var iconDesc = data.weather[0].description;
            var currentWeatherIconEl = $('<img>');
            currentWeatherIconEl.attr("src", weatherIconUrl + icon);
            currentWeatherIconEl.attr("alt", weatherIconUrl + iconDesc);
            cityDateEl.append(currentWeatherIconEl);
            
            //info for current div
            var tempEl = $('<p>');
            tempEl.text("Temp: " + data.main.temp + " \u2109 ");
            var windEl = $('<p>');
            windEl.text("Wind: " + data.wind.speed + " MPH");
            var humidityEl = $('<p>');
            humidityEl.text("Humidity: " + data.main.humidity + "%");
            



            currentWeatherEl.append(cityDateEl, tempEl, windEl, humidityEl);
            
        })
    fetch(weatherUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var UvDivEl = $('<div>');
            UvDivEl.attr("class", "d-inline-flex bd-highlight")
            var UvEl = $('<p>');
            UvEl.text("UV Index: ")
            var UvValueEl = $('<p>');
            if(data.current.uvi < 3){
                UvValueEl.attr("class", "bg-success rounded text-white ms-3 px-3 justify-content-center");
                UvValueEl.text(data.current.uvi);
            }
            else if(data.current.uvi >=8){
                UvValueEl.attr("class", "bg-danger rounded text-white ms-3 px-3 justify-content-center");
                UvValueEl.text(data.current.uvi);
            }
            else{
                UvValueEl.attr("class", "bg-warning rounded text-black ms-3 px-3 justify-content-center");
            }
            UvDivEl.append(UvEl);
            UvDivEl.append(UvValueEl);
            currentWeatherEl.append(UvDivEl);
            $("#fiveday").empty();
            //Five Day Cards
            for(i=1;i<6;i++){
                var year = new Date(data.daily[i].dt*1000).getUTCFullYear();
                var day = new Date(data.daily[i].dt*1000).getUTCDate();
                var month = new Date(data.daily[i].dt*1000).getUTCMonth() + 1;
                var date = month + "/" + day + "/" + year;
                //debugger;
                var weatherCardEl = $('<div>');
                    weatherCardEl.attr("class", "card col-2 bg-primary text-white");
                    var weatherCardBodyEl = $('<div>');
                        weatherCardBodyEl.attr("class", "card-body ");
                        var weatherCardTitleEl = $('<h6>');
                            weatherCardTitleEl.addClass("card-title");
                            weatherCardTitleEl.text(date);
                            
                        var weatherCardIconEl = $('<img>');
                            var weatherIconUrl = "https://openweathermap.org/img/wn/"
                            var icon = data.daily[i].weather[0].icon + ".png";
                            var iconDesc = data.daily[i].weather[0].description;
                            weatherCardIconEl.attr("src", weatherIconUrl + icon);
                            weatherCardIconEl.attr("alt", weatherIconUrl + iconDesc);

                        var weatherCardTemp = $('<p>');
                            weatherCardTemp.attr("card-text");
                            weatherCardTemp.text("Temp: " + data.daily[i].temp.max + " \u2109 ");

                        var weatherCardWind = $('<p>');
                            weatherCardWind.attr("card-text");
                            weatherCardWind.text("Wind: " + data.daily[i].wind_speed +" MPH");

                        var weatherCardHumidity = $('<p>');
                            weatherCardHumidity.attr("card-text");
                            weatherCardHumidity.text("Humidity: " + data.daily[i].humidity + " %");
                        weatherCardBodyEl.append(weatherCardTitleEl, weatherCardIconEl, weatherCardTemp, weatherCardWind, weatherCardHumidity);
                    weatherCardEl.append(weatherCardBodyEl);
                fiveDayEl.append(weatherCardEl);

            }
        })

    
}
var test = function(){
    console.log(this.id);
}
formEl.on('submit', getLatLong);
historyEl.on('click', 'button', function(){
    getWeather(recentCities[this.id].lat, recentCities[this.id].long);
});