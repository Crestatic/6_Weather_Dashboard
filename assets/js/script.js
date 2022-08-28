var ApiKey = "240f9877b419432748ef97872bd89380";
var searchHistory = [];
var errorContainerEl = document.querySelector('#errorContainer')
var weatherContainerEl = document.querySelector('#weatherContainer')
$('#searchBtn').on('click', searchAction);

function searchAction(event) {
    event.preventDefault();

    var cityInput = $('#cityInput').val();
    // console.log(cityInput);

    saveSearch(cityInput);
    fetchWeather(cityInput);

}

function saveSearch(cityInput) {

    if (!searchHistory.includes(cityInput)) {

        searchHistory.push(cityInput);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))

        renderHistory();
    }
}

function renderHistory() {
    // historyEl.empty();  // does not work.  Not sure why...
    $('#history').empty(); 

    var savedSearch = JSON.parse(localStorage.getItem('searchHistory'));
    
    for (var i = 0; i < savedSearch.length; i++) {
        var cityBtn = document.createElement('button');
        cityBtn.classList.add("searchHistoryBtn")
        
        cityBtn.innerText = savedSearch[i];
        
        $('#history').append(cityBtn);
    }
}

var fetchWeather = async cityInput => {

    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=${ApiKey}`
    
    //If else for invalid city input.
    var response = await fetch(weatherURL);
    if (response.status === 404) {
        errorContainerEl.classList.remove('hide');
    } else {
        var weather = await response.json();
        console.log(weather);
    }
    
    renderWeather(weather);
    fetchUVI(weather)
    
}


function renderWeather(weather) {
    
    // $('#weatherContainer').classList.remove('hide');
    var cityInput = $('#cityInput').val();
    
    // Variables used to grab current weather Icon from API
    var weatherIcon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
    // console.log(weatherIcon);

    let currentTime = weather.dt;
    let timeZone = weather.timezone;
    let timeZoneHours = timeZone / 60 / 60;
    let displayTime = moment.unix(currentTime).utc().utcOffset(timeZoneHours);

    
    var weatherInnerHTML = `
        <div>
            <h3> ${cityInput} ${displayTime.format("(MM/DD/YYYY)")} <img src="${weatherIcon}"></h3>
            <h6> Temperature: ${weather.main.temp} °F </h6>
            <h6> Wind: ${weather.wind.speed} MPH </h6>
            <h6> Humidity: ${weather.main.humidity} % </h6>
            <h6> UV Index: <button id="UVI"></button>
        </div>

    `;

    weatherContainerEl.innerHTML = weatherInnerHTML;
    
    
    console.log(weatherContainerEl);
}

function fetchUVI(weather) {

    var cityLat = weather.coord.lat;
    var cityLon = weather.coord.lon;

    var coordsURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&appid=${ApiKey}`
    
    fetch(coordsURL).then(function(res) {
        res.json().then(function(data) {
            console.log(data)
            
            renderUVI(data)
        })
    })
}

function renderUVI(data) {
    var UVIndex = data.value;
    console.log(UVIndex);

    $('#UVI').text(UVIndex);

    if (UVIndex <= 2) {
        $("#UVI").attr("class", "favorable");
      } else if (UVIndex > 2 && UVIndex <= 7) {
        $("#UVI").attr("class", "moderate");
      } else {
        $("#UVI").attr("class", "severe");
      }

}

