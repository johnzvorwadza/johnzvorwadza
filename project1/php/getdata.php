<?php

$base_url = "http://api.geonames.org/";
$base_query = "?username=johnzvoradza";
$url = null;

if(!$_GET['country']){
  $_GET['country'] = "";
}

$url = $base_url. "countryInfoJSON". $base_query. "&country=". $_GET['country'];

function getPosition($city, $countryCode) {
	$opts = array('http'=>array('header'=>"User-Agent: MyCleverAddressScript 1.0.0\r\n"));
	$context = stream_context_create($opts);
	$query = "https://api.opencagedata.com/geocode/v1/json?key=63f5b2c7334a4ba8a5d4b17fd9d7543d&limit=1&q=".urlencode($city);
	//$query = "https://nominatim.openstreetmap.org/search.php";
	$result = file_get_contents($query, false, $context);
	return $result;
}

function getRegions($base_url, $base_query,$geonames_id){
	$dataToReturn = [];
$regionData = file_get_contents($base_url. "childrenJSON". $base_query. "&geonameId=".$geonames_id);
$region= json_decode($regionData);
foreach($region->geonames as $element){
	array_push($dataToReturn, $element);
}

return $dataToReturn;
}


$data = file_get_contents($url);
$decodedData = json_decode($data);
$decodedData->status = "ok";

$borderData = file_get_contents("countryBorder.json");
$border = json_decode($borderData);

foreach ($decodedData->geonames as $key => $country) {
    
    for($i = 0; $i < count($border->features);$i++){
if($border->features[$i]->properties->iso_a2 == $country->fipsCode || $border->features[$i]->properties->iso_a3 == $country->isoAlpha3){
    $decodedData->geonames[$key]->geometry = $border->features[$i]->geometry;
}
}

//set Earthquakes array
$earthquakesData = file_get_contents($base_url. "earthquakesJSON". $base_query. "&north=". $country->north. "&south=". $country->south. "&west=". $country->west. "&east=". $country->east);
$earthquakes= json_decode($earthquakesData);
$decodedData->geonames[$key]->earthquakes = $earthquakes->earthquakes;

//Set Capital Longtude and Lattude object
$capitalData = getPosition($country->capital,$country->isoAlpha3);
$capital = json_decode($capitalData);
$decodedData->geonames[$key]->capitalCity = $capital->results[0]->geometry;	

//set Current Weather
$weatherquakesData = file_get_contents("https://api.openweathermap.org/data/2.5/weather?lat=".$capital->results[0]->geometry->lat."&lon=".$capital->results[0]->geometry->lng."&appid=75817526beecf3fdaac095574f6343a3");
$weather= json_decode($weatherquakesData);
$decodedData->geonames[$key]->weather = $weather;

//set news array
$newsData = file_get_contents("http://api.mediastack.com/v1/news?languages=en&access_key=65f4055d37dcc6c698bd9bc4549ef0b3&countries=".$country->countryCode);
$news= json_decode($newsData);
$decodedData->geonames[$key]->news = $news->data;

//set Regions
$regions = getRegions($base_url, $base_query, $country->geonameId);
$decodedData->geonames[$key]->regions = $regions;

//set covid array
//$covidData = file_get_contents("https://covid19-api.weedmark.systems/api/v1/total?country=".$country->countryCode);
//$covid= json_decode($covidData);
//$decodedData->geonames[$key]->covid = $covid->data;

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=". urlencode($country->countryName),
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: covid-19-coronavirus-statistics.p.rapidapi.com",
		"X-RapidAPI-Key: 262b7e6211msh361bcb2a7deec67p146520jsnce86027c9728"
	],
]);

curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
$covidData = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {

	

} else {
	$covid= json_decode($covidData);
	$decodedData->geonames[$key]->covid = $covid->data;

	
	
}



//set National Holidays array
$holidaysData = file_get_contents("https://calendarific.com/api/v2/holidays?&api_key=c80912bd5b90856bc68a709d28909d053a264f1a&year=2022&country=".$country->countryCode);
$holidays= json_decode($holidaysData);
$decodedData->geonames[$key]->holidays = $holidays->response->holidays;


  }


header('Content-Type: application/json; charset=UTF-8');
echo json_encode($decodedData);

?>