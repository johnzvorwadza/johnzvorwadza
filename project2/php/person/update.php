<?php
include "../functions.php";
	$executionStartTime = microtime(true);


	$firstname = remove_whitespace($_REQUEST['firstname']);
	$lastname = remove_whitespace($_REQUEST['lastname']);
	$jobTitle = remove_whitespace($_REQUEST['jobTitle']);
	$email = remove_whitespace($_REQUEST['email']);
	


    ////check if FirstName is valid
    if(strlen($firstname) == 0){
        $output['status']['code'] = "402";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "First Name Can Not be Empty";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

    }

	////check if LastName is valid
    if(strlen($lastname) == 0){
        $output['status']['code'] = "402";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Last Name Can Not be Empty";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

    }

	////check if JobTitle is valid
    if(strlen($jobTitle) == 0){
        $output['status']['code'] = "402";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Job Title Can Not be Empty";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

    }

	// Validate email
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $output['status']['code'] = "402";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Invalid email";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
        return_error($output);

	}


	////check if department is valid
	$qnumrowsLocation = $conn->prepare("SELECT * FROM department WHERE id = ?");
	$qnumrowsLocation->bind_param("i", $_REQUEST['departmentID']);
	$qnumrowsLocation->execute();
	$qnumrowsLocation->store_result();
	
    if($qnumrowsLocation->num_rows < 1){

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "invalid department";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

    }




	///is dublicate?
	$qnumrows = $conn->prepare("SELECT * FROM `personnel` WHERE id != ? AND firstname = ? AND lastname = ?;");
	$qnumrows->bind_param("iss", $_REQUEST['id'], $firstname, $lastname);
	$qnumrows->execute();
	$qnumrows->store_result();
	
    if($qnumrows->num_rows > 0){

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "personnel already in use";	
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

	


	

	//Update personnel
	$query = $conn->prepare("UPDATE personnel SET firstname = ?, lastname = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?;");

	$query->bind_param("ssssii", $firstname, $lastname, $jobTitle, $email, $_REQUEST['departmentID'], $_REQUEST['id']);

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
	$queryFetch = $conn->prepare("SELECT personnel.* , department.locationID as locationID FROM `personnel` INNER JOIN department ON personnel.departmentID = department.id WHERE firstname = ? AND lastname = ? ;");
	$queryFetch->bind_param("ss", $firstname, $lastname);
	$queryFetch->execute();
	$queryFetch->bind_result($personnelId, $personnelfname, $personnellname, $personneljobtitle, $personnelemail, $departmentID, $locationID);

    while($r = mysqli_stmt_fetch($queryFetch)){
    array_push($data, [$personnelId, $personnelfname, $personnellname, $personneljobtitle, $personnelemail, $departmentID, $locationID]);
}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>