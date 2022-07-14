<?php
include "../functions.php";
	$executionStartTime = microtime(true);

	$data = [];
	$queryFetch = $conn->prepare("SELECT personnel.* , department.locationID as locationID FROM `personnel` INNER JOIN department ON personnel.departmentID = department.id WHERE personnel.id = ?;");
	$queryFetch->bind_param("i", $_REQUEST['id']);
	$queryFetch->execute();
	$queryFetch->bind_result($personnelId, $personnelfname, $personnellname, $personneljobtitle, $personnelemail, $departmentID, $locationID);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($data, [$personnelId, $personnelfname, $personnellname, $personneljobtitle, $personnelemail, $departmentID, $locationID]);
}

$departments = [];
$q = mysqli_query($conn, "SELECT * FROM department ORDER BY name ASC");
while($r = mysqli_fetch_assoc($q)){
array_push($departments, [$r['id'], $r['name'], $r['locationID']]);
}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	$output['departments'] = $departments;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>