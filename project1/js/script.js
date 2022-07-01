var pageLoaded = false;

var map = L.map("leafletmap").setView([54.560886, -2.2125118], 6);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=0HLZZcuxYLMWKHWYKuKc', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);


const localMarkers = [];


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
borderMarker.setStyle({
    color:"yellow"
});
map.setView([capitalCity.lat, capitalCity.lng], 6);
map.fitBounds(borderMarker.getBounds(), 8);


var capitalCityMarkerIcon = L.ExtraMarkers.icon({
    icon: 'fa-burst',
    iconColor: "red",
    shape: 'square',
    prefix: 'fa'
  });



var earthquakesMarkerIcon = L.ExtraMarkers.icon({
    icon: 'fa-burst',
    iconColor: "red",
    shape: 'square',
    prefix: 'fa'
  });


const earthquakesMarkers = L.markerClusterGroup();
earthquakes.forEach(eq =>{
    eqmarker = L.marker([eq.lat, eq.lng],{
        icon:earthquakesMarkerIcon
    }).addTo(earthquakesMarkers).bindPopup(`<div><h3>Earthquake</h3>magnitude :${eq.magnitude}<hr/>datetime: ${eq.datetime}</div>`);  
});
map.addLayer(earthquakesMarkers);

const regions = countryObj.regions;
const regionsMarkers = L.markerClusterGroup();
regions.forEach(element=>{
    var popUpDetails = document.createElement("div");
    popUpDetails.className = "markerPopup";
    var h3 = document.createElement("h3");
    h3.append(element.toponymName);
    popUpDetails.append(h3);
    var population = document.createElement("p");
    population.append(`population : ${numeral(element.population).format()}`)
    popUpDetails.append(population);


    var locationMarkerIcon = L.ExtraMarkers.icon({
        icon: 'fa-location-dot',
        iconColor: "#333",
        shape: 'square',
        prefix: 'fa'
      });
    



    L.marker([element.lat, element.lng], {icon: locationMarkerIcon}).addTo(regionsMarkers).bindPopup(popUpDetails).on("click", ()=>{

        var markerLoading = document.createElement("img");
        markerLoading.setAttribute("src","src/loading.gif");
        markerLoading.className = "loading";

        popUpDetails.appendChild(markerLoading)

        if(localMarkers.filter(lm=> lm === element.geonameId).length > 0){
            popUpDetails.removeChild(markerLoading);
        }else{
            $.ajax({
                url:"php/getLocalData.php"
                ,type:"GET"
                ,dataType:"json"
                ,data:{
                    lat:element.lat
                    ,lon:element.lng
                    

                }
                ,success: weatherObj=>{

                    
                    popUpDetails.removeChild(markerLoading);

                    //set weather:::
                    var markerWeather = document.createElement("div");
                    markerWeather.innerHTML = `<h5>Current Weather</h5>
            <div>
                
                <span>${weatherObj.weather[0].description}</span>
                <span><img src="http://openweathermap.org/img/wn/${weatherObj.weather[0].icon}.png"/></span>
            </div>

            <div>
                <span>Temp</span>
                <span>${Math.floor(weatherObj.main.temp - 273.15)}&deg;</span>
            </div>

            <div>
                <span>High Temp</span>
                <span>${Math.floor(weatherObj.main.temp_max - 273.15)}&deg;</span>
            </div>

            <div>
                <span>Low Temp</span>
                <span>${Math.floor(weatherObj.main.temp_min - 273.15)}&deg;</span>
            </div>

            <div>
                <span>Wind Speed</span>
                <span>${weatherObj.wind.speed}</span>
            </div>

            <div>
                <span>Humidity</span>
                <span>${weatherObj.main.humidity}</span>
            </div>`;




                    popUpDetails.appendChild(markerWeather);
                    localMarkers.push(element.geonameId);

                }
                ,error: (error, status, errorType)=>{
                    popUpDetails.removeChild(markerLoading);
                    alert(errorType);
                }
            })
        }
    
});

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
        
            alert("Sorry, there was an error making your request. \n"+errorType);
        }
    });
}

function changeCountry(){
    $("#loading").fadeIn(100);
    $.ajax({
        url:"php/getdata.php"
        ,type:"GET"
        ,dataType:"json"
        ,data:{
            country: $("#country").val()
            ,type: 'capital'
        }
        ,success: function(result){
            //set basic details
            $(".countryName").html(result['geonames'][0].countryName);
            $("#capital").html(result['geonames'][0].capital);
            $("#population").html(numeral(result['geonames'][0].population).format());
            $("#continentName").html(result['geonames'][0].continentName);
            $("#currencyCode").html(result['geonames'][0].currencyCode);
            $("#flag").attr("src",`https://countryflagsapi.com/png/${result['geonames'][0].countryName}`);

            //set weather details
            const weatherObj = result['geonames'][0].weather;
            $("#currentWeather").html(weatherObj.weather[0].description);
            $("#temperature").html(Math.floor(weatherObj.main.temp - 273.15) +"&deg;");
            $("#highTemperature").html(Math.floor(weatherObj.main.temp_max - 273.15)+"&deg;");
            $("#lowTemperature").html(Math.floor(weatherObj.main.temp_min - 273.15)+"&deg;");
            $("#windSpeed").html(weatherObj.wind.speed+ "mph");
            $("#humidity").html(weatherObj.main.humidity+ "%");

            
            $(".weatherIcon").attr("src",`http://openweathermap.org/img/wn/${weatherObj.weather[0].icon}@2x.png`);

            

            //set news
            var news = result['geonames'][0].news;
            $("#news").html("");
            news.forEach(element=>{
                let newsImg = ""
                if(element.image !== null && element.image !== undefined){
                    newsImg =  `<img src="${element.image}"/>`;
                }
                
                $("#news").append(`<div class="newsItem">
                <h3>${element.title}</h3>
                ${newsImg}
                <p>${element.description}</p>
                <a class="btn btn-info btn-lg"  target="_blank" href="${element.url}">Full Story</a>
            </div><hr/>`);
            });


            //set National Holidays
            var holidays = result['geonames'][0].holidays;
            $("#holidays").html("");
            holidays.forEach(element=>{
                $("#holidays").append(`
                <div>
                <h3>${element.name}</h3>
                <span>${element.date.iso}</span>
                <p>${element.description}</p>

                </div>
                <hr/>
                
                `);
            });




            //Set Covid data
            var covid = result['geonames'][0].covid;
            if(covid !== undefined && covid !== null){
                //$("#covid").html(JSON.stringify(covid));
                $("#Cases_text").html(numeral(covid.confirmed).format());
                $("#Deaths_text").html(numeral(covid.deaths).format());
            }
            

           

            //set Markers
            setMarkers(result['geonames'][0]);
            pageLoaded = true;

            $("#loading").fadeOut(1000);

        }
        ,error: function(err , status, errorType){
            alert("Sorry, there was an error making your request. \n"+errorType);
            console.log(JSON.stringify(err));
            if(pageLoaded === true){
                $("#loading").fadeOut(1000);
            }

        }
    });


}


L.easyButton('<i class="fa fa-circle-info"></i>', function(btn, map){
    $("#infoModal").modal();
  }).addTo(map);
  
  L.easyButton('<i class="fa fa-newspaper"></i>', function(btn, map){
    $("#newsModal").modal();
  }).addTo(map);
  
  L.easyButton('<i class="fa fa-bacteria"></i>', function(btn, map){
    $("#covidModal").modal();
  }).addTo(map);
  
  L.easyButton('<i class="fa fa-calendar"></i>', function(btn, map){
    $("#holidaysModal").modal();
  }).addTo(map);
  
  L.easyButton('<i class="fa fa-sun"></i>', function(btn, map){
    $("#weatherModal").modal();
  }).addTo(map);
  



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


    $("#country").on("change", ()=>{
        changeCountry();
    });

    


});