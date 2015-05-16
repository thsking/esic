<?php

	
	require_once('sql-connect.php');
	require_once('functions.php');


	$sc_user_cookie = json_decode(@$_COOKIE['sc_user_cookie']);


	if(count($sc_user_cookie)==1){


		$sc_user = [
			'ID' => $sc_user_cookie->id,
			'Name' => $sc_user_cookie->username,
			'Avatar' => $sc_user_cookie->avatar_url,
			'Link' => $sc_user_cookie->permalink_url
		];


		// CHECK IF USER ALREADY EXIST AND HAVE LOCALISATION
		$q = 'SELECT * FROM users WHERE ID_Soundcloud='.$sc_user['ID'].' LIMIT 1';
		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$user=$stmt->fetchAll();
		

		if(count($user)>0 && $user[0]['Last_Position']!=''){
			echo true;
		}		


	}


?>