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
        console.log(cityBtn);
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
}

// function fetchWeather(cityInput) {

//     var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${ApiKey}`
//     console.log(weatherURL);
//     fetch(weatherURL).then(function(response) {

//         if (response.status === 404) {
//             $('#errorContainer').classList.remove('hide');
//             $('#weatherContainer').classList.add('hide');
//         } else {
//             response.json().then(function(data) {
//                 renderWeather(data, cityInput);
//             });
//         }
//     });
// }

function renderWeather(weather) {
    
    // $('#weatherContainer').classList.remove('hide');
    var cityInput = $('#cityInput').val();
    
    var iconLoc = weather.weather[0].icon
    var weatherIcon = `https://openweathermap.org/img/w/${iconLoc}.png`
    console.log(weatherIcon);
    let currentTime = weather.dt;
    let timeZone = weather.timezone;
    let timeZoneHours = timeZone / 60 / 60;
    let displayTime = moment.unix(currentTime).utc().utcOffset(timeZoneHours);

    var cityLat = weather.coord.lat;
    var cityLon = weather.coord.lon;
    
    var weatherContent = document.createElement('div');
    
    var weatherInnerHTML = `
        <div class="card">
            <h3>${cityInput} ${displayTime.format("(MM/DD/YY)")} <img src="${weatherIcon}"></h3>
            

        </div>

    `;

    weatherContent.innerHTML = weatherInnerHTML;
    console.log(weatherContent);
    weatherContainerEl.appendChild(weatherContent);
    
    console.log(weatherContainerEl);
}