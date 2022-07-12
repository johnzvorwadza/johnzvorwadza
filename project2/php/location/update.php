<?php
	$executionStartTime = microtime(true);

    include "../functions.php";

	header('Content-Type: application/json; charset=UTF-8');

	$name = $_REQUEST['name'];

	///remove excess white space from name
	$name = remove_whitespace($name);

	///is name not empty
	if(strlen($name) == 0){
        $output['status']['code'] = "402";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Location Name Can Not be Empty";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

    }

	///check if data is not already in database
	$qnumrows = $conn->prepare("SELECT * FROM location WHERE name = ? and id != ?");
	$qnumrows->bind_param("si", $name, $_REQUEST['id']);
	$qnumrows->execute();
	$qnumrows->store_result();
	
    if($qnumrows->num_rows > 0){

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "location already in use";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

    }


    /////



	$query = $conn->prepare("UPDATE location SET name =  ? WHERE id = ?");

	$query->bind_param("si", $name, $_REQUEST['id']);

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

    $data = [];
    $queryFetch = $conn->prepare("SELECT * FROM `location` WHERE id = ?;");
	$queryFetch->bind_param("i", $_REQUEST['id']);
	$queryFetch->execute();
	$queryFetch->bind_result($locationId, $locationName);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($data, [$locationId, $locationName]);
}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>