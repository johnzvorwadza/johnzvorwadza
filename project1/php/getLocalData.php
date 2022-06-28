<?php

$weatherquakesData = file_get_contents("https://api.openweathermap.org/data/2.5/weather?lat=".$_GET['lat']."&lon=".$_GET['lon']."&appid=75817526beecf3fdaac095574f6343a3");
$weather= json_decode($weatherquakesData);

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($weather);

?>