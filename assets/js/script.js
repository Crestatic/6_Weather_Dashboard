// Global variables
var ApiKey = "240f9877b419432748ef97872bd89380";
var searchHistory = [];
var errorContainerEl = document.querySelector('#errorContainer')
var weatherContainerEl = document.querySelector('#weatherContainer')

// Event listener for search button.
$('#searchBtn').on('click', searchAction);

function searchAction(event) {
    event.preventDefault();

    var cityInput = $('#cityInput').val();
    
    saveSearch(cityInput);
    fetchWeather(cityInput);
}

// Save search input into local storage
function saveSearch(cityInput) {

    if (!searchHistory.includes(cityInput)) {

        searchHistory.push(cityInput);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))

        renderHistory();
    }
}

// renders search into onto html as search buttons and adds event listener for said buttons
function renderHistory() {
    
    $('#history').empty(); 

    var savedSearch = JSON.parse(localStorage.getItem('searchHistory'));
    
    for (var i = 0; i < savedSearch.length; i++) {
        var cityBtn = document.createElement('button');
        cityBtn.classList.add("searchHistoryBtn")
        
        cityBtn.innerText = savedSearch[i];
        
        $('#history').append(cityBtn);
        $('.searchHistoryBtn').on('click', historySearch);
    }
}

renderHistory()

function historySearch(event) {
    event.preventDefault();
    let cityInput = $(this).text();

    fetchWeather(cityInput);
}

// Fetch weather for city input and start the function for weather, UVI, and forcast
var fetchWeather = async cityInput => {

    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=${ApiKey}`
    
    //If else for invalid city input.
    var response = await fetch(weatherURL);
    if (response.status === 404) {
        errorContainerEl.classList.remove('hide');
        weatherContainerEl.classList.add('hide');
    } else {
        var weather = await response.json();
        // console.log(weather);
        renderWeather(weather);
        fetchUVI(weather);
        fetchForcast(weather);
    }
    
  
}


function renderWeather(weather) {
    
    errorContainerEl.classList.add('hide');
    weatherContainerEl.classList.remove('hide');

    var cityInput = $('#cityInput').val();
    
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
        <h2> 5 day forcast: </h2>
        <div id="forcast">

        </div>
    `;

    weatherContainerEl.innerHTML = weatherInnerHTML;
}

function fetchUVI(weather) {

    let cityLat = weather.coord.lat;
    let cityLon = weather.coord.lon;

    var coordsURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&appid=${ApiKey}`
    
    fetch(coordsURL).then(function(res) {
        res.json().then(function(data) {
            // console.log(data)
            
            renderUVI(data)
        })
    })
}

// Render UVI data and add color coded class depending on severity
function renderUVI(data) {
    var UVIndex = data.value;

    $('#UVI').text(UVIndex);

    if (UVIndex <= 4) {
        $("#UVI").attr("class", "favorable");
      } else if (UVIndex > 4 && UVIndex <= 8) {
        $("#UVI").attr("class", "moderate");
      } else {
        $("#UVI").attr("class", "severe");
      }
}

function fetchForcast(weather) {

    let cityLat = weather.coord.lat;
    let cityLon = weather.coord.lon;

    var forcastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=${ApiKey}`

    fetch(forcastURL).then(function(res) {
        res.json().then(function(data) {
            // console.log(data)
            
            renderForcast(data)
        })
    })
}

function renderForcast(data) {
    var forcastEl = document.querySelector('#forcast');

    for (var i = 0; i < data.list.length; i++) {
        let response = data.list[i];
        
        let currentTime = response.dt;
        let timeZone = data.city.timezone;
        let timeZoneHours = timeZone / 60 / 60;
        let time = moment.unix(currentTime).utc().utcOffset(timeZoneHours);
       
        let forcastIcon = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`
        
        if (time.format("HH:mm:ss") === "11:00:00" || time.format("HH:mm:ss") === "12:00:00" || time.format("HH:mm:ss") === "13:00:00") {

            var forcastCard = document.createElement('div');
            forcastCard.classList.add('forcastCard');

            forcastInnerHTML = `
            <div class="card">
                <h6> ${time.format("MM/DD/YY")}<img src="${forcastIcon}"> </h6>
                
                <p> Temp: ${response.main.temp} °F </p>
                <p> Wind: ${response.wind.speed} MPH </p>
                <p> Humidity: ${response.main.humidity} % </p>
            </div>
            `
            forcastCard.innerHTML = forcastInnerHTML;
            forcastEl.appendChild(forcastCard);
        }     
    }   
}


