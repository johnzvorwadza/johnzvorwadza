<?php

$base_url = "http://api.geonames.org/";
$base_query = "?username=johnzvoradza";
$url = null;


$type = "capital";
if($_GET['type']){
$type = $_GET['type'];
}

if($type == "capital"){
    $url = $base_url. "countryInfoJSON". $base_query. "&country=". $_GET['country'];
}
else if($type=="borders"){
    $url = $base_url. "neighboursJSON". $base_query. "&country=". $_GET['country']; 
}

else if($type=="timezone"){
    $url = $base_url. "timezoneJSON". $base_query. "&style=full&lat=". $_GET['lt']."&lng=". $_GET['ln']; 
}

if($url !== null){
    $data = file_get_contents($url);
$decodedData = json_decode($data);
$decodedData->status = "ok";
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($decodedData);
}else{

header('Content-Type: application/json; charset=UTF-8');
echo "{\"status\": \"error\"}";

}







?>