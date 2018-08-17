<?php
require("removeOldTmpFiles.php");

//get the iteration from post, eg ps04_0001 and call the packager with that string.
if ($_POST && $_POST['iteration']) {
    cogneroPacker($_POST['iteration'], true);
}

/* cogneroPacker
 * This method takes in a template string in the form psXX_YYZZ[Z] where X is the template number, Y is the grade and Z is the question
 *  and builds a cognero zip package. It will copy all of the files within that templates' code path (../templates/ps01/) into a new temp folder
 *  as well as read in the files within the specific iterations data folder (../../parcc/iterations/ps01_0001). After compiling this temp folder,
 *  it compiles a manifest file for cognero with unique ids and zips up all the files and delivers it to the user via the web(also saved in 
 *  ../../parcc/iterations/ps01_0001/tempzips/).
 *
 *  $iteration : string : The iteration name string (psXX_YYZZ[Z])
 *  $fromWeb : boolean  : decides if we need to deliver the zip back or return the string filename
 */
function cogneroPacker($iteration, $fromWeb) {
    try {
        //Build Paths to needed locations
        $root = realpath("../");
        $pieces = explode("_",$iteration);
        $path = $root . '/templates/' . $pieces[0] ."/"; 
        $dataPath = realpath("../../parcc/iterations/" . $iteration) . "/";
        
        //copy required files to new directory (for easy zipping)
        $dir = copyToDir($dataPath,$path,0777);
        $tmpName = basename($dir);
        
        //make the hidden zips folder under iteration path
        if (!is_dir($dataPath."/tempzips")) mkdir($dataPath."/tempzips");
        chmod($dataPath."/tempzips",0777);
        
        $zipName = "{$iteration}.zip";
        $zipFullPath = $dataPath."tempzips/".$tmpName.$zipName;

        //Create the zip file and add the manifest file
        $zip = new ZipArchive();
        $zip->open($zipFullPath, ZIPARCHIVE::CREATE);
        $zip = addFolderToZip($dir,$zip);
        $zip->addFromString("manifest.xml",buildManifestString($dir,$path));
        $zip->close();
        chmod($zipFullPath, 0777);
        
        //deliver zip via the web or return the zip file name.
        if ($fromWeb) {
            //Send the zip to the browser
            header("Pragma: public");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: private",false);
            header("Content-Type: application/zip");
            header("Content-Disposition: attachment; filename=\"".basename($zipName)."\"");
            header("Content-Transfer-Encoding: binary");
            header("Content-Length: ".filesize($zipFullPath));
            ob_clean();
            flush();
            ob_end_flush();
            readfile($zipFullPath);
            exit;
        } else {
            return $zipFullPath;
        }
    } catch (exception $e) {
        throw new exception("Failed to package '$iteration'::".$e->getMessage());
    }
}

//Gets the full path names recursively for the given dir
function getFullPaths($dir) {
    $objects = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, 
                RecursiveDirectoryIterator::SKIP_DOTS)
        , RecursiveIteratorIterator::SELF_FIRST );
    $arr = array();
    foreach ($objects as $file) {
        if ($file->isFile() && 
            strpos($file->getPathname(), "/.")===false) {
            array_push($arr, $file->getPathname());
        }
    }
    usort($arr, "mySort");
    return $arr;

}

//Gets the relative path names to the given $dir, recursively
function getRelativePaths($dir) {
    $arr = getFullPaths($dir);
    for($i=0;$i < count($arr);$i++) {
        $arr[$i] =  substr($arr[$i],strlen($dir));
    }
    return $arr;
}
//Builds a random tmp name dir Returns dir path
function tempdir ($dir, $prefix='', $mode=0777) {
    if (substr($dir, -1) != '/') $dir .= '/';
    do
    {
        $path = $dir.$prefix.mt_rand(0, 9999999);
    } while (!mkdir($path, $mode));

    return $path;
}

//Copies needed cognero files to tmp dir under the iteration/{id}/tempzips
function copyToDir ($templatePath, $codePath, $perms) {
    $codeFiles = getFullPaths($codePath);
    $dataFiles = getFullPaths($templatePath);

    if (substr($templatePath, -1) != '/') $templatePath .= '/';
    $base = realpath("../../parcc/iterations/" ) . "/tmp/";
    if (!is_dir($base)) {
        mkdir($base);
        chmod($base,$perms);
    }
    $dir = tempdir($base, "Zip", $perms);
    chmod($dir, $perms);

    //We do not copy in files whose paths contain a substr of an of the following
    $ignoreMatch = array("ib_layout_thumbs","json","data.js");
    
    //We store the contents of some files and compile into one to remove load dependancy issues
    $pageBuilder = "";
    $code="";
    $grader="";

    //First we loop through the template folder code files
    //copy most files directly, ignore some, and compile into one main.js file others (also add JSONObject to grading.js
    foreach($codeFiles as $f) {
        $relPath = substr($f, strlen($codePath));

        //check for ignorables
        foreach($ignoreMatch as $ig) {
            if (strpos($relPath, $ig) > -1)
                continue 2;
        }

        //build tmp destination folder structure
        $dest = $dir . "/" . $relPath;
        $pieces = explode("/",$dest);
        array_pop($pieces);
        $destDir = implode("/",$pieces);
        if (!is_dir($destDir)) {
            mkdir($destDir,$perms);
            chmod($destDir,$perms);
        }
        
        //store code for some files, else straight copy to tmp dir
        if (preg_match('/ps[0-9]+\.js/',$f)) {
            $code = "///////Main Template JS///////\n".file_get_contents($f)."\n";
        } elseif (substr($f,-14) == "pageBuilder.js") {
            $pageBuilder = "//////Page Builder File/////\n".file_get_contents($f)."\n";
        } elseif (substr($f, -10) == "grading.js") {
            $grader = "//////Grading File//////\n".file_get_contents($f)."\n";
        } else {
            copy($f, $dest);
            chmod($dest, $perms);
        }
    }

    //Next we loop through the data files for this specific iteration
    //we store the JSON data file and use to compile in both main.js and grading.js
    $ignoreMore = array("tempzips");
    $json="";
    foreach($dataFiles as $f) {
        //We need to flatten out our image files into the main level of zip in order to be able to allow cognero to correctly
        //  substitute out the references for "getCogneroMedia?id=blahblah" references.
        $relPath = substr($f, strlen($templatePath));
        if (strpos($relPath,"images/") > -1 ) {
            $relPath = substr($relPath,7);
        }
        //check for ignorables
        foreach($ignoreMore as $ig) {
            if (strpos($relPath, $ig) > -1)
                continue 2;
        }
        
        //build out the destination folder structure
        $dest = $dir . "/" . $relPath;
        $pieces = explode("/",$dest);
        array_pop($pieces);
        $destDir = implode("/",$pieces);
        if (!is_dir($destDir)) {
            mkdir($destDir,$perms);
            chmod($destDir,$perms);
        }
        
        //if its the data.json file take the contents and insert it into an if statement to avoid cognero overwriting the substituted getCogneroMedia 
        // version stupidly(bug on their end, but fixed with this if statement)
        // else: straight copy the files
        if (substr($f, -9) == "data.json") {
            $json = "//////Data File//////\nvar JSONObject = JSONObject || false;\nif (!JSONObject || (typeof(JSON) != 'undefined' && !JSON.stringify(JSONObject).match(/cognero/i))) {\n JSONObject = " . file_get_contents($f).";\n}\n";
        } else {
            copy($f, $dest);
            chmod($dest, $perms);
        }
    }

    //Write My compiled main.js file
    $fileContents = $json . $code . $pageBuilder;
    file_put_contents($dir . "/main.js", $fileContents);
    chmod($dir."/main.js", $perms);
    
    //Write compiled Grading file
    $fileContents = $json . $grader;
    file_put_contents($dir."/Grading/grading.js",$fileContents);
    chmod($dir."/Grading/grading.js", $perms);

    return $dir;
}

//helper sort function to make dir building happen in order, using shorter strings first.
function mySort($a,$b) {
    return strlen($a) - strlen($b);
}

//entire folder and its subfolders to a zip file returns zip file
function addFolderToZip($source, $zip)
{
    if (!extension_loaded('zip') || !file_exists($source)) {
        return false;
    }

    $source = str_replace('\\', '/', realpath($source));

    if (is_dir($source) === true)
    {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

        foreach ($files as $file)
        {
            $file = str_replace('\\', '/', $file);

            // Ignore "." and ".." folders
            if( in_array(substr($file, strrpos($file, '/')+1), array('.', '..')) )
                continue;

            $file = realpath($file);

            if (is_dir($file) === true)
            {
                $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
            }
            else if (is_file($file) === true)
            {
                $zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
            }
        }
    }
    else if (is_file($source) === true)
    {
        $zip->addFromString(basename($source), file_get_contents($source));
    }

    return $zip;
}

//This helps sort the priority of the manifest file, because apparently the order of the 
// resources determines their load position, which messes up the replacements.
// it uses the getMime functions array position to get the priority level. with the exception 
// that main.js must always come last
function priority($a,$b) {
    $posA = 0; $posB = 0;
    getMime($a, $posA);
    getMime($b, $posB);
    if (substr($a,-7) == "main.js") return 1; elseif (substr($b,-7) == "main.js") return -1;
    return $posA - $posB;
}

//Builds out the manifest xml string by reading in the base.xml and editing/adding to it.
function buildManifestString($dir,$codePath) {
    $resources = getRelativePaths($dir);
    
    usort($resources, "priority");
    //$xml = new SimpleXMLElement("<xml/>");
    $xml = simplexml_load_file("{$codePath}base.xml"); 
    
    $xml->XHTMLBody->ResourceFile->addChild("UniqueID",GUID());
    $xml->SampleImage->ResourceFile->addChild("UniqueID",GUID());
    $xml->GradingJavascript->ResourceFile->addChild("UniqueID",GUID());
    $xml->GradingJavascript->ResourceFile->PackagePath = "Grading/grading.js";
    
    //ignore these files for manifest purposes since they are either already in the base.xml or not needed.
    $ignoreMatch = array("Sample.png","index.html","base.xml","Grading");
    // list of loadAfter=true flagged files(not really sure if this is needed still since we compiled the main.js)
    $loadAfters = array ("main.js","jqueryui.js");
    
    //go through the resources list of filepaths and build manifest based on the file extension, ignorable, loadAfters
    for($i = 0; $i < count($resources); $i++) {
        foreach ($ignoreMatch as $ig) {
        if (strpos($resources[$i],$ig) > -1)
            continue 2;
        }
        $mime = getMime($resources[$i]);
        $r = $xml->Resources->addChild("Resource");
        $rf = $r->addChild("ResourceFile");
        $rf->addChild("UniqueID",GUID());
        $rf->addChild("PackagePath", substr($resources[$i],1));
        $r->addChild("MimeType", $mime);
        if(strpos($mime, "image") > -1 && strpos($resources[$i], "images") > -1) {
            $pieces = explode("/",$resources[$i]);
            $r->addChild("ReferencedAs", array_pop($pieces));
        } else {
            $r->addChild("ReferencedAs", substr($resources[$i],1));
        }
        $ref = $r->addChild("ReferenceReplacement");
        $ref->addChild("AllowReplacement", "true");
        if($mime == "application/javascript") {
            $loadAfter = "false";
            foreach($loadAfters as $la) {
                if (strpos($resources[$i], $la) > -1)
                    $loadAfter = "true";
            }
            $jo = $r->addChild("JavascriptOptions");
            $jo->addChild("AutoLoad","true");
            $jo->addChild("LoadAfterBody",$loadAfter);
        }
    }
    $dom = new DOMDocument('1.0');
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;
    $dom->loadXML($xml->asXML());
    return $dom->saveXML();
}
//creates a GUID 
function GUID()
{
    if (function_exists('com_create_guid') === true)
    {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X',
         mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479),
         mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}
//gets relative mime types for cognero (also used as a sort priority, if pos is not null)
function getMime($r, &$pos=null) {
    $pieces = explode(".",$r);
    $mime_types = array(
        // images
        'png' => 'image/png',
        'jpe' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'bmp' => 'image/bmp',
        'ico' => 'image/vnd.microsoft.icon',
        'tiff' => 'image/tiff',
        'tif' => 'image/tiff',
        'svg' => 'image/svg+xml',
        'svgz' => 'image/svg+xml',

        //Font
        'woff'=>'application/font-woff',
        'ttf'=>'application/font-sfnt',

        //'txt' => 'text/plain',
        //'htm' => 'text/html',
        'css' => 'text/css',
        'php' => 'text/html',
        'json' => 'application/json',
        'xml' => 'application/xml',
        'html' => 'text/html',
        'js' => 'application/javascript',
       // 'swf' => 'application/x-shockwave-flash',
       // 'flv' => 'video/x-flv',
        // audio/video
        //'mp3' => 'audio/mpeg',
        //'qt' => 'video/quicktime',
        //'mov' => 'video/quicktime',
        // adobe
        //'pdf' => 'application/pdf',
        //'psd' => 'image/vnd.adobe.photoshop',
        //'ai' => 'application/postscript',
        //'eps' => 'application/postscript',
        //'ps' => 'application/postscript',
    );
    $ext = pathinfo($r, PATHINFO_EXTENSION);
    if (array_key_exists($ext,$mime_types)) {
        if (!is_null($pos)) {
            $pos = array_search($ext,array_keys($mime_types));
        }
        return $mime_types[$ext];
    }
    return false;
}
?>
