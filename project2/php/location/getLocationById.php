<?php
	$executionStartTime = microtime(true);

    include "../functions.php";

	header('Content-Type: application/json; charset=UTF-8');


    $data = [];
    $queryFetch = $conn->prepare("SELECT * FROM `location` WHERE id = ?;");
	$queryFetch->bind_param("i", $_REQUEST['id']);
	$queryFetch->execute();
	$queryFetch->bind_result($locationId, $locationName);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($data, [$locationId, $locationName]);
}


$queryD = $conn->prepare("SELECT * FROM `department` WHERE locationID = ?;");
$queryD->bind_param("i", $_REQUEST['id']);
$queryD->execute();
$queryD->store_result();
$count = $queryD->num_rows;

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
    $output['count'] = $count;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>