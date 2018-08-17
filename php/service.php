<?php

error_reporting(0);

//$root = realpath($_SERVER["DOCUMENT_ROOT"] . "/../"); // remote - this does not work on local...
$root = realpath("../../"); // Local

// var_dump(realpath(dirname(__FILE__) . "/../"));
// echo "<br>";
// var_dump($root);
// echo "<br>";

$mypath=$root . $_POST['path']; 
$myfile=$_POST['file']; 

umask(0);
if ( is_dir( $mypath ) == false ) {
	mkdir($mypath,0777,TRUE);
} 

$filename = $mypath . '/' . $myfile;

$handle = fopen( $filename,"w");
$return_json = $_POST['json']; 
// fwrite($handle,json_encode($return_json));

//echo $return_json;
//$return_json = $return_json; //stripslashes($return_json); //this breaks it
//json_encode($return_json)
$fwrite = fwrite($handle, $return_json);

$success = 0;

if ($fwrite !== false) {
    $success = 1; //Success
}

echo json_encode (
	array("success" => $success,"file"=>$mypath)
    //$_SERVER
);
// echo "Success<br>";
// echo "<br>";
// echo $mypath . "<br>";
// echo $filename . "<br>";
// echo json_encode($return_json) . "<br>";

fclose($handle);

// if (is_dir($mypath) !== false) {
// 	chmod($filename, 0777);
// }

if (file_exists($filename) !== false) {
	chmod($filename, 0777);
}

?>
