<?php

$ln = $_GET['ln'];
$lt = $_GET['lt'];

function getCountry($lt, $ln) {
	$opts = array('http'=>array('header'=>"User-Agent: MyCleverAddressScript 1.0.0\r\n"));
	$context = stream_context_create($opts);
	$query = "https://nominatim.openstreetmap.org/reverse?format=json&lat=".$lt."&lon=".$ln;
	$result = file_get_contents($query, false, $context);
    $decodedResults = json_decode($result);
	return strtoupper($decodedResults->address->country_code);
}

$countries = [];
$borderData = file_get_contents("countryBorder.json");
$border = json_decode($borderData);
foreach ($border->features as $country) {
    if($country->properties->iso_a2 !== "-99"){
        array_push($countries,  [$country->properties->name, $country->properties->iso_a2]);
    }   
}
sort($countries);
$results = [getCountry($lt,$ln), $countries];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($results);

?>