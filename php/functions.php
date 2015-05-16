<?php 


function distance($lat1, $lon1, $lat2, $lon2) {

	// FUNCTION GET ON http://www.geodatasource.com/developers/php

	$theta = $lon1 - $lon2;

	$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));

	$dist = acos($dist);

	$dist = rad2deg($dist);

	$miles = $dist * 60 * 1.1515;

	return round($miles * 1.609344);

}




function sortByDistance($a, $b){
	return $a['Distance'] - $b['Distance'];
}





function checkAndUpdateUserInfo($old, $new, $infoNameInTable, $id, $bdd){

	// if old and soundcloud info isnt same
	if($old!=$new){

		$q = "UPDATE users SET ".$infoNameInTable." = '".$new."' WHERE ID=".$id;
		$stmt = $bdd->prepare($q);

		try {
			$stmt->execute();
		}catch(Exception $e){

		}
	}

}



function cookiePut($name, $value){
	$duration_day = 1;
	$duration_day = time() + (86400 * $duration_day);
	setcookie($name, $value, $duration_day, '/');
}

function cookieGet($name){
	return @$_COOKIE[$name];
}

function cookieRemove($name){
	$duration_day = time() - (86400 * 5);
	setcookie($name, "", $duration_day, '/');
}


function escapeJsonString($value) { # list from www.json.org: (\b backspace, \f formfeed)
    $escapers = array("\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c");
    $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b");
    $result = str_replace($escapers, $replacements, $value);
    return $result;
}

?>