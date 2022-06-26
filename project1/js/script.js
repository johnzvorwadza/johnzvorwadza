
var map = L.map("leafletmap").setView([54.560886, -2.2125118], 6);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=0HLZZcuxYLMWKHWYKuKc', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);



function setMarkers(countryObj){
    const geometry = countryObj.geometry;
    const capitalCity = countryObj.capitalCity;
    const earthquakes = countryObj.earthquakes;
    map.eachLayer((layer) => {
        layer.remove();
      });
      L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=0HLZZcuxYLMWKHWYKuKc', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

var borderMarker = L.geoJSON(geometry).addTo(map);
map.setView([capitalCity.lat, capitalCity.lng], 6);
map.fitBounds(borderMarker.getBounds(), 8);


const earthquakesMarkers = L.markerClusterGroup();
earthquakes.forEach(eq =>{
    eqCircleMarker = L.circleMarker([eq.lat, eq.lng],{
        color:'red'
        ,title: eq.datetime
    }).addTo(earthquakesMarkers).bindPopup(`<div><h3>Earthquake</h3>magnitude :${eq.magnitude}<hr/>datetime: ${eq.datetime}</div>`);  
});
map.addLayer(earthquakesMarkers);

const regions = countryObj.regions;
const regionsMarkers = L.markerClusterGroup();
regions.forEach(element=>{
    L.marker([element.lat, element.lng]).addTo(regionsMarkers).bindPopup(`
<div><h3>${element.toponymName}</h3>population : ${element.population}</div>`);

})
map.addLayer(regionsMarkers);

}


function loadCountries(ln, lt){
    $.ajax({
        url:"php/getCountriesList.php"
        ,type:"GET"
        ,dataType:"json"
        ,data:{
            ln:ln
            ,lt:lt
        }
        ,success: function(result){

            result[1].forEach(element => {
                if(result[0] === element[1]){
                    $("#country").append(`<option selected="true" value="${element[1]}">${element[0]}</option>`);

                }else{
                $("#country").append(`<option value="${element[1]}">${element[0]}</option>`);
                }
            });
            changeCountry();

        }
        ,error: function(err , status, errorType){
        
            alert("Sorry, there was an error making your request.");
        }
    });
}

function changeCountry(){
    $("#news").html("");
    $("#results").slideUp(200);
    $("#weather").slideUp(200);
    $(".newsCont").slideUp(200);
    $("#loading").fadeIn(100);
    
    var value = $("#country").val();

    $.ajax({
        url:"php/getdata.php"
        ,type:"GET"
        ,dataType:"json"
        ,data:{
            country: value
            ,type: 'capital'
        }
        ,success: function(result){
            //set basic details
            $(".countryName").html(result['geonames'][0].countryName);
            $("#capital").html(result['geonames'][0].capital);
            $("#population").html(result['geonames'][0].population);
            $("#continentName").html(result['geonames'][0].continentName);
            $("#currencyCode").html(result['geonames'][0].currencyCode);
            $("#flag").attr("src",`https://countryflagsapi.com/png/${result['geonames'][0].countryName}`);

            //set weather details
            const weatherObj = result['geonames'][0].weather;
            $("#currentWeather").html(weatherObj.weather[0].main+" / "+weatherObj.weather[0].description);
            $("#temperature").html(Math.floor(weatherObj.main.temp - 273.15) +"&deg;");
            $("#highTemperature").html(Math.floor(weatherObj.main.temp_max - 273.15)+"&deg;");
            $("#lowTemperature").html(Math.floor(weatherObj.main.temp_min - 273.15)+"&deg;");
            $("#windSpeed").html(weatherObj.wind.speed);
            $("#humidity").html(weatherObj.main.humidity);


            //set news
            var news = result['geonames'][0].news;
            news.forEach(element=>{
                let newsImg = ""
                if(element.image !== null && element.image !== undefined){
                    newsImg =  `<img src="${element.image}"/>`;
                }
                
                $("#news").append(`<div class="newsItem">
                ${newsImg}
                <h5>${element.title}</h5>
                <p>${element.description}
                <a target="_blank" href="${element.url}">Full Story</a></p>
            </div>`);
            });
           

            //set Markers
            setMarkers(result['geonames'][0]);

            $("#results").slideUp(200);
            $("#weather").slideUp(200);
            $(".newsCont").slideUp(200);
            $("#loading").fadeOut(1000);

        }
        ,error: function(err , status, errorType){
            $("#results").slideUp(200);
            $("#weather").slideUp(200);
            $(".newsCont").slideUp(200);
            $("#loading").fadeOut(1000);
            alert("Sorry, there was an error making your request.");
        }
    })

}



$(document).ready(()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            loadCountries(position.coords.longitude ,position.coords.latitude);
        },()=>{
            loadCountries( 51.509865 , -0.118092);
        })
    }else{
        loadCountries( 51.509865 , -0.118092);
    }

    

    $("#info").on("click", ()=>{
        $(".newsCont").slideUp(50);
        $("#results").slideToggle(200);
    });

    $("#weatherbtn").on("click", ()=>{
        $(".newsCont").slideUp(50);
        $("#weather").slideToggle(200);
    });

    $("#newsbtn").on("click", ()=>{
        $("#results").slideUp(50);
        $("#weather").slideUp(50);
        $(".newsCont").slideToggle(200);
    });

    $("#country").on("change", ()=>{
        changeCountry();
    });
    


});


