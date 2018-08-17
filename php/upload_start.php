<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
// $upload_handler = new UploadHandler();
//$root = realpath($_SERVER["DOCUMENT_ROOT"] . "/../"); // remote - this does not work on local...
$root = realpath($_SERVER["DOCUMENT_ROOT"]); // Local

$upload_dir = $root . $_GET["path"] . '/images/';
$options = array('upload_dir' => $upload_dir);
$upload_handler = new UploadHandler($options);
