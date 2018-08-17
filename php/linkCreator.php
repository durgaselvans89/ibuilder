<?php
$dirName = realpath("../../parcc/iterations");
$iterations = getDirNames($dirName);
$arr = array();
foreach ($iterations as $it) {
    $matches = array();
    if (preg_match("/ps([0-9]+)_([0-9]{1})([0-9]{3})$/",$it,$matches)) {
        if (count($matches) == 4) {
            $matches[2] = sprintf('%02d', $matches[2]);
            if ( !isset($arr[$matches[1]])) {
                $arr[$matches[1]] = array("name"=>"Iteration: {$matches[1]}","link"=>"","sub"=>array());
            }
            if (!isset($arr[$matches[1]]["sub"][$matches[2]])) {
                $arr[$matches[1]]["sub"][$matches[2]] = array("name"=>"Grade: {$matches[2]}","link"=>"","sub"=>array());
            }
            if (!isset( $arr[$matches[1]]["sub"][$matches[2]]["sub"][$matches[3]])){
                $arr[$matches[1]]["sub"][$matches[2]]["sub"][$matches[3]] =  array("name"=>"Question: {$matches[3]}","link"=>$matches[0]);
            }
        }
    }
}
foreach ($iterations as $it) {
    $matches = array();
    if (preg_match("/ps([0-9]+)_([0-9]{2})([0-9]{3})$/",$it,$matches)) {
        if (count($matches) == 4) {
            if ( !isset($arr[$matches[1]])) {
                $arr[$matches[1]] = array("name"=>"Iteration: {$matches[1]}","link"=>"","sub"=>array());
            }
            if (!isset($arr[$matches[1]]["sub"][$matches[2]])) {
                $arr[$matches[1]]["sub"][$matches[2]] = array("name"=>"Grade: {$matches[2]}","link"=>"","sub"=>array());
            }
            if (!isset( $arr[$matches[1]]["sub"][$matches[2]]["sub"][$matches[3]])){
                $arr[$matches[1]]["sub"][$matches[2]]["sub"][$matches[3]] =  array("name"=>"Question: {$matches[3]}","link"=>$matches[0]);
            }
        }
    }
}
$arr2 = array("menu" => array("name"=>"Switch Question","link"=>"","sub"=>$arr));
echo json_encode($arr2);
exit;
file_put_contents("links.json",json_encode($arr2));

function getDirNames($dirName) {
    $arr = array();
    $dir = new DirectoryIterator($dirName);
    foreach ($dir as $fileinfo) {
        if (!$fileinfo->isDot() && $fileinfo->isDir())  {
            if (strpos($fileinfo->getPathname(),"tmp") !== -1) { 
                array_push($arr,array_pop(explode("/",$fileinfo->getPathname())));
            }
        }
    }
    sort($arr);
    return $arr;
}
?>
