var prvCities = [];
var dayMarkers = [0, 8, 16, 24, 32,];

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
    newBtn.attr({type:'button', class:'list-group-item list-group-item-action prvCity', datacity: lastCity});
    newBtn.text(lastCity);
    $('#searchedCities').append(newBtn);
};

function saveList () {
    localStorage.setItem('prvCities', JSON.stringify(prvCities));
};

function makeForecast (newFrcst) {
    $('#frcst').empty();
    dayMarkers.forEach(function (myDate) {
        var time = newFrcst.list[myDate].dt;
        var picf = newFrcst.list[myDate].weather[0].icon;
        var tempf = newFrcst.list[myDate].main.temp;
        var humf = newFrcst.list[myDate].main.humidity;
        var s = new Date(time * 1000).toLocaleDateString("en-US");
        var current = $('<div>');
        var dateDiv = $('<div>');
        var picDiv = $('<img>');
        var tempDiv = $('<div>');
        var humDiv = $('<div>');
        current.attr('class', 'col');
        dateDiv.attr('class', 'row');
        picDiv.attr({class: 'row frcstbx', src: 'https://openweathermap.org/img/wn/' + picf + '.png'});
        tempDiv.attr('class', 'row');
        humDiv.attr('class', 'row');
        dateDiv.text(s);
        tempDiv.text('Temp: ' + tempf + ' \u00B0F');
        humDiv.text('Humidity: ' + humf + '%');
        current.append(dateDiv);
        current.append(picDiv);
        current.append(tempDiv);
        current.append(humDiv);
        $('#frcst').append(current);
    });
};

function update (place) {
    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + place + '&units=imperial&APPID=cad9eb6e38bd8ec8d96c293c18381b8e';
    var frcstURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + place + '&units=imperial&APPID=cad9eb6e38bd8ec8d96c293c18381b8e';
    $.ajax({
        url : queryURL,
        method : 'GET',
    }).done(function (response) {
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=cad9eb6e38bd8ec8d96c293c18381b8e'
        var cityName = response.name;
        var tempNow = response.main.temp;
        var humNow = response.main.humidity;
        var windNow = response.wind.speed;
        var pic = response.weather[0].icon;
        if (prvCities.indexOf(cityName) < 0) {
            prvCities.push(cityName)
        };
        saveList();
        $('#searchedCities').empty();
        prvCities.forEach(populateList);
        $('#myCity').text(cityName);
        $('#tempNow').text('Temperature: ' + tempNow + ' \u00B0F');
        $('#humNow').text('Humidity: ' + humNow + '%');
        $('#windNow').text('Wind Speed: ' + windNow + ' MPH');
        $('#iconNow').attr('src', 'https://openweathermap.org/img/wn/' + pic + '.png')
        $.ajax({
            url : uvURL,
            method : 'GET',
        }).done(function (uvVar) {
            var uvDiv = $('#uvNow');
            var uvIndex = uvVar.value;
            uvDiv.removeClass('favorable moderate severe');
            if (uvIndex < 3) {
                uvDiv.addClass('favorable');
            } else if (uvIndex > 5) {
                uvDiv.addClass('severe');
            } else {
                uvDiv.addClass('moderate');
            };
            uvDiv.text(uvIndex);
        });
    });
    $.ajax({
        url : frcstURL,
        method : 'GET',
    }).done(function (forecast) {
        makeForecast(forecast);
    });
}

$('#searchBtn').on('click', function() {
    var city = $('#citySearch').val();
    update(city);
});

$(document).on("click", ".prvCity", function () {
    var location = $(this).attr("datacity");
    update(location);
});

getList();
