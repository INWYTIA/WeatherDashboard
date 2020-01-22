//key = cad9eb6e38bd8ec8d96c293c18381b8e

//current weather url = 
//http://api.openweathermap.org/data/2.5/weather?q= {city name} &units=imperial&APPID=cad9eb6e38bd8ec8d96c293c18381b8e
// ...weather?id= {city id}
// ...weather?zip= {us zip code},{optional country code}

//forcast url = 
//api.openweathermap.org/data/2.5/forecast?q=London  all parameters apply

//uv url = 
//api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37
//http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}&cnt={days} 

var prvCities = [];

function getList () {
    var oldList = JSON.parse(localStorage.getItem('prvCities'));
    if (oldList === null) {
        saveList();
    } else {
        prvCities = oldList;
    };
    prvCities.forEach(populateList);
};

function populateList (lastCity) {
    var newBtn = $('<button>');
    newBtn.attr({type:'button', class:'list-group-item list-group-item-action prvCity'});
    newBtn.text(lastCity);
    $('#searchedCities').append(newBtn);
};

function saveList () {
    localStorage.setItem('prvCities', JSON.stringify(prvCities));
};

$('#searchBtn').on('click', function() {
    var city = $('#citySearch').val();
    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&APPID=cad9eb6e38bd8ec8d96c293c18381b8e'
    $.ajax({
        url : queryURL,
        method : 'GET',
    }).done(function (response) {
        if (prvCities.indexOf(response.name) < 0) {
        prvCities.push(response.name)};
        saveList();
        $('#searchedCities').empty();
        prvCities.forEach(populateList);
        console.log(response);
        console.log(prvCities);
    })
});

getList();
