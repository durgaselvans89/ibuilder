<?php
//Build list of files/folders to check for age then delete.
$dirName = realpath("../../parcc/iterations");
$paths = getDirNames($dirName);
for ($i =0; $i < count($paths);$i++) {
    $paths[$i] = $paths[$i] . "/tempzips/.";
}
$morePaths = getDirNames(realpath("../tempzips"));
for ($i = 0; $i < count($morePaths); $i++) {
    array_push($paths, $morePaths[$i] . "/.");
}
$evenMorePaths = getDirNames(realpath("../../parcc/iterations/tmp"));
for ($i = 0; $i < count($evenMorePaths); $i++) {
    array_push($paths, $evenMorePaths[$i] . "/.");
}

removeOldDirsFromList($paths);

//if last modification is older than 10 seconds, we delete any file/folder listed in $dirNames
function removeOldDirsFromList($dirNames) {
    $interval = strtotime('-10 seconds');
    for ($i=0; $i < count($dirNames);$i++) {
        if (file_exists($dirNames[$i])) {
            if (filemtime($dirNames[$i]) <= $interval) {
                unlinkRecursive(substr($dirNames[$i],0,-1),true);
            }
        }
    }
}

//gets the directories listed in a folder
function getDirNames($dirName) {
    $arr = array();
    try {
    $dir = new DirectoryIterator($dirName);
    foreach ($dir as $fileinfo) {
        if (!$fileinfo->isDot() && $fileinfo->isDir())  {
            if (strpos($fileinfo->getPathname(),"tmp") !== -1) { 
                array_push($arr,$fileinfo->getPathname());
            }
        }
    }
    sort($arr);
    return $arr;
    }catch(Exception $e) {
        return $arr;
    }
}

//removes folders and all its contents.
function unlinkRecursive($dir, $deleteRootToo) 
{ 
    if(!$dh = @opendir($dir)) 
    { 
        return; 
    } 
    while (false !== ($obj = readdir($dh))) 
    { 
        if($obj == '.' || $obj == '..') 
        { 
            continue; 
        } 
        if (!@unlink($dir . '/' . $obj)) 
        { 
            unlinkRecursive($dir.'/'.$obj, true); 
        } 
    } 
    closedir($dh); 
    if ($deleteRootToo) 
    { 
        @rmdir($dir); 
    } 
    return; 
} 
?>
