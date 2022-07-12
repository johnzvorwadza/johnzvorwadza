<?php
include "../functions.php";
	$executionStartTime = microtime(true);
	
	$name = $_REQUEST['name'];
	


    
	///remove excess white space from name
	$name = remove_whitespace($name);

	///is name not empty
	if(strlen($name) == 0){
        $output['status']['code'] = "402";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Department Name Can Not be Empty";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

    }



    ////check if location is valid
	$qnumrowsLocation = $conn->prepare("SELECT * FROM location WHERE id = ?");
	$qnumrowsLocation->bind_param("i", $_REQUEST['locationID']);
	$qnumrowsLocation->execute();
	$qnumrowsLocation->store_result();
	
    if($qnumrowsLocation->num_rows < 1){

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "invalid location";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

    }



	///is name a dublicate
	$qnumrows = $conn->prepare("SELECT * FROM department WHERE name = ? AND id != ?");
	$qnumrows->bind_param("si", $name, $_REQUEST['id']);
	$qnumrows->execute();
	$qnumrows->store_result();
	
    if($qnumrows->num_rows > 0){

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "department already in use";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

    }






    /////



	if ($conn->connect_errno) {
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare("UPDATE department SET name = ? , locationID = ?  WHERE id = ?");

	$query->bind_param("sii", $name, $_REQUEST['locationID'], $_REQUEST['id']);

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
	$queryFetch = $conn->prepare("SELECT * FROM `department` WHERE id= ?;");
	$queryFetch->bind_param("i", $_REQUEST['id']);
	$queryFetch->execute();
	$queryFetch->bind_result($departmentId, $departmentName, $locationId);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($data, [$departmentId, $departmentName, $locationId]);
}
    



	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>