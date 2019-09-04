<?php
$path = pathinfo($_SERVER["SCRIPT_FILENAME"]);
if ($path["extension"] == "mjs") {
	header("Content-Type: text/javascript");
	readfile($_SERVER["SCRIPT_FILENAME"]);
} else {
	return FALSE;
}
?>

