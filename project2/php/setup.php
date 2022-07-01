<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=400, user-scalable=no'" />
        <link href="css/bootstrap.min.css" rel="stylesheet" />
       <style>
           body{
               background:#000;
               color:#fff;
           }
       </style>
       
        <title>Setup</title>
        
        
    </head>
    <body>
        
        
        <div class="container">
            
            <div class="row">
                <h1>Setup</h3>
            </div>
            <div class="row">
                <form action="setup.php" method="post">
                <h4>Host <small><input value="localhost" name="host" type="text"></small></h4>
                <h4>Database <small><input value="weliveto_company_directory" name="db" type="text"></small></h4>
                <h4>Username <small><input value="weliveto_1" name="username" type="text"></small></h4>
                <h4>Password <small><input value="Legend1994john" name="db_password" type="text"></small></h4>
                <input name="submit" type="submit" value="START">
                </form>
            </div>
            
            
        </div>
        
        
    </body>
</html>

<?php
$dbusername = $_POST['username'];
$db = $_POST['db'];
$dbpassword = $_POST['db_password'];
$dbsv = $_POST['host'];
$dollarsign = "$";
if($_POST['submit'] ==""){
    die();
}


//////validate the information//////
$conn = mysqli_connect($dbsv, $dbusername, $dbpassword, $db);
if($conn){
    
}else{
    print "<p style='color:red;'>.......Failed to validate database information .......<br/>";
    print mysqli_connect_error(). "...</p>";
    die();
}


//////create a connect.php page/////
$myfile = fopen("connect.php", "w") or die("Unable to open file!");
$txt = "<?php 
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
{$dollarsign}dbusername = \"{$dbusername}\"; 
{$dollarsign}db = \"{$db}\";
{$dollarsign}dbpassword = \"{$dbpassword}\";
{$dollarsign}dbsv = \"{$dbsv}\"; 
{$dollarsign}conn = mysqli_connect({$dollarsign}dbsv, {$dollarsign}dbusername, {$dollarsign}dbpassword, {$dollarsign}db);

?>";
fwrite($myfile, $txt);
fclose($myfile);
print "<p style='color:green;'>....... Database information validated successfully.......</p>";
/////////create the tables on the database////////
print "<p style='color:green;'>....... STARTING TO CREATE TABLES.......</p>";
//$data = mysqli_query($conn, $q);

function createTable($conn, $q, $tablename){
    $query = mysqli_query($conn, $q);
    if($query){
        print "<p style='color:green;'>- {$tablename} table created successfully...</p>";
    }else{
        print "<p style='color:red;'>- error occurred while trying to create {$tablename} table ...<br>";
        print mysqli_error($query). "</p>";
    }
}

/////Create Locations Table////
$tablename = "locations";
$q = "CREATE TABLE {$tablename}
(id int NOT NULL AUTO_INCREMENT
,name varchar(255)
,PRIMARY KEY (id)
)";
createTable($conn, $q, $tablename);


/////Create Departments Table////
$tablename = "departments";
$q = "CREATE TABLE {$tablename}
(id int NOT NULL AUTO_INCREMENT
,name varchar(255)
,PRIMARY KEY (id)
)";
createTable($conn, $q, $tablename);


/////Create Employees Table////
$tablename = "employees";
$q = "CREATE TABLE {$tablename}
(id int NOT NULL AUTO_INCREMENT
,fname varchar(255)
,lname varchar(255)
,role varchar(255)
,department int
,location int
,PRIMARY KEY (id)
,FOREIGN KEY (departmen) REFERENCES departments(id)
,FOREIGN KEY (location) REFERENCES locations(id)
)";

createTable($conn, $q, $tablename);



print "<p style='color:green;'>....... Setup complited.......</p>";

?>