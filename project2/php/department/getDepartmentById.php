<?php
include "../functions.php";
	$executionStartTime = microtime(true);
    
	
	$data = [];
	$queryFetch = $conn->prepare("SELECT * FROM `department` WHERE id= ?;");
	$queryFetch->bind_param("i", $_REQUEST['id']);
	$queryFetch->execute();
	$queryFetch->bind_result($departmentId, $departmentName, $locationId);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($data, [$departmentId, $departmentName, $locationId]);
}

$locations = [];
$q = mysqli_query($conn, "SELECT * FROM location ORDER BY name ASC");
while($r = mysqli_fetch_assoc($q)){
array_push($locations, [$r['id'], $r['name']]);
}

$queryP = $conn->prepare("SELECT * FROM `personnel` WHERE departmentID = ?;");
$queryP->bind_param("i", $_REQUEST['id']);
$queryP->execute();
$queryP->store_result();
$count = $queryP->num_rows;
    
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
    $output['locations'] = $locations;
    $output['count'] = $count;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>