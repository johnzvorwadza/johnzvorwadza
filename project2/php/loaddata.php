<?php
include "functions.php";


$locations = [];
$q = mysqli_query($conn, "SELECT * FROM location ORDER BY name ASC");
while($r = mysqli_fetch_assoc($q)){
array_push($locations, [$r['id'], $r['name']]);
}

$departments = [];
$q = mysqli_query($conn, "SELECT * FROM department ORDER BY name ASC");
while($r = mysqli_fetch_assoc($q)){
array_push($departments, [$r['id'], $r['name'], $r['locationID']]);
}


$people = [];
	$queryFetch = $conn->prepare("SELECT personnel.* , department.locationID as locationID FROM `personnel` INNER JOIN department ON personnel.departmentID = department.id ORDER BY lastname ASC;");
	$queryFetch->execute();
	$queryFetch->bind_result($personnelId, $personnelfname, $personnellname, $personneljobtitle, $personnelemail, $departmentID, $locationID);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($people, [$personnelId, $personnelfname, $personnellname, $personneljobtitle, $personnelemail, $departmentID, $locationID]);
}

$data = [$people, $locations, $departments];

    return_success($data);
?>