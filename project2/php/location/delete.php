<?php
	$executionStartTime = microtime(true);
	include("../functions.php");

	header('Content-Type: application/json; charset=UTF-8');


    ///check to see if any personnel are using the department
	$qdepartment = $conn->prepare("SELECT * FROM department WHERE locationID = ?");
	$qdepartment->bind_param("s", $_REQUEST['id']);
	$qdepartment->execute();
	$qdepartment->store_result();
	
    if($qdepartment->num_rows > 0){

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "One or more department is using this location";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

    }
	
	///delete location

	$query = $conn->prepare('DELETE FROM location WHERE id = ?');
	
	$query->bind_param("i", $_REQUEST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
    $output['id'] = $_REQUEST['id'];
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>