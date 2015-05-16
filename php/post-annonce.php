<?php

	require_once('sql-connect.php');
	require_once('functions.php');


	// GET POSTED DATA
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	

	// FETCH POSTED DATA
	@$instrument = $request->instrument;
	@$style = $request->music_style;
	@$description = $request->description;



	// GET USER 
	$user = json_decode(cookieGet('user'));


	// CHECK if user is connected
	if(count($user)>0){

		// check if all data required is present
		if(
			$instrument!='' &&
			$style != '' &&
			$description != ''
			){

			$q = 'INSERT INTO annonces (ID, ID_User, Instrument, Style, Description, Date_Creation, Vues) VALUES ("", "'.$user->ID.'", "'.$instrument.'", "'.$style.'", "'.$description.'","'.time().'", "0")';
			$stmt = $bdd->prepare($q);
			$stmt->execute();

		}

	}


?>