<?php
require_once "./cogneroPackager.php";

$paths = array("ps04_0001","ps05_0001");
if (($handle = fopen(realpath("../")."/packageNames.csv", "r")) !== FALSE) {
    $paths = array();
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        $row++;
        for ($c=0; $c < $num; $c++) {
            array_push($paths,$data[$c]);
        }
    }
    fclose($handle);
}

$zip = new ZipArchive();
$zipName = "allZips.zip";
$td = tempdir(realpath("../tempzips"), "", 0777);
chmod($td, 0777);
$zipFullPath = $td ."/". $zipName;

$zip->open($zipFullPath, ZIPARCHIVE::CREATE);
$err = false;
foreach ($paths as $path) {
    try {
        if (trim($path) != "") {
            $zip->addFile(cogneroPacker(trim($path),false),trim($path).".zip");
        }
    } catch (exception $e) {
        $err = $e->getMessage();
        break;
    }
}
$zip->close();
chmod($zipFullPath, 0777);
if (!$err && file_exists($zipFullPath)) {
    chmod($zipFullPath, 0777);
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
}
echo $err."\n";
?>
