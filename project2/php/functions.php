<?php
include "config.php";

$conn = mysqli_connect($cd_host, $cd_user, $cd_password, $cd_dbname);

function remove_whitespace($string){
    return trim(preg_replace('/[\t\n\r\s]+/', ' ', $string));
}


function num_rows($q){
    return mysqli_num_rows($q);
}

function return_error($error){
    header('Content-Type: application/json; charset=UTF-8');
    echo '{"status": "error", "error": '. json_encode($error). '}';
    die();
}

function return_success($data){
    header('Content-Type: application/json; charset=UTF-8');
    echo '{"status": "ok", "data": '. json_encode($data). '}';
    die();
}
?>