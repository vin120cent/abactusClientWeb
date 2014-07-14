<?php

if (!function_exists('encodePassword')) {
	function encodePassword($pw) {
		return sha1($pw);
	}
}

?>
