<?php 

	require_once("sql-connect.php");
	require_once('functions.php');


	if(@$_GET['to']=='only' && @$_GET['userId']!='' && @$_GET['pos'] != ''){

		// GET USER_ASKING POS
		$pos = json_decode(htmlentities($_GET['pos']));
		$pos = [
			'lat' => $pos[0],
			'lon' => $pos[1]
		];

		// GET USER_ASKING INFOS
		$userId = htmlentities($_GET['userId']);

		$query = 'SELECT * FROM users WHERE ID="'.$userId.'"';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$user = $stmt->fetchAll();


		// GET DISTANCE BETWEEN USER_ASK & USER_PROFIL
		$userPos = json_decode($user[0]['Last_Position']);
		$userPos = [
			'lat' => $userPos[0],
			'lon' => $userPos[1]
		];

		$distance = distance($pos['lat'], $pos['lon'], $userPos['lat'], $userPos['lon']);



		// GET ACTIVE ANNONCE OF THE USER_PROFIL

		$query = 'SELECT ID, Instrument, Style FROM annonces WHERE ID_User='.$userId;

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$annonces = $stmt->fetchAll();

		for($i=0;$i<count($annonces);$i++){
			$annonces[$i] = [
				'ID' => $annonces[$i]['ID'],
				'Instrument' => $annonces[$i]['Instrument'],
				'Style' => $annonces[$i]['Style']
			];
		}



		// MAKE ARRAY OUT 
		$userOut = [
			'ID' => html_entity_decode($user[0]['ID']),
			'ID_Soundcloud' => html_entity_decode($user[0]['ID_Soundcloud']),
			'Name' => html_entity_decode($user[0]['Name']),
			'Instrument_Favorit' => html_entity_decode($user[0]['Instrument_Favorit']),
			'Instrument_Other' => html_entity_decode($user[0]['Instrument_Other']),
			'Style' => html_entity_decode($user[0]['Style']),
			'Description' => html_entity_decode($user[0]['Description']),
			'Last_Position' => html_entity_decode($user[0]['Last_Position']),
			'First_Connection' => html_entity_decode($user[0]['First_Connection']),
			'Last_Connection' => html_entity_decode($user[0]['Last_Connection']),
			'Avatar' => html_entity_decode($user[0]['Avatar']),
			'Link_Soundcloud' => html_entity_decode($user[0]['Link_Soundcloud']),
			'Link_Twitter' => html_entity_decode($user[0]['Link_Twitter']),
			'Link_Facebook' => html_entity_decode($user[0]['Link_Facebook']),
			'Distance' => html_entity_decode($distance),
			'Annonces' => $annonces
		];

		echo json_encode($userOut);
	}


	elseif(@$_GET['to']=='list' && @$_GET['pos']){


		// GET USER_ASKING POSITION in Array lat/long

		$pos = json_decode(htmlentities($_GET['pos']));
		$pos = [
			'lat' => $pos[0],
			'lon' => $pos[1]
		];



		// GET USERS

		$query = 'SELECT * FROM users LIMIT 0,100';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$users = $stmt->fetchAll();



		for($i=0;$i<count($users);$i++){

			// GET DISTANCE BETWEEN THIS USER AND USER_ASKING
			
			$userPos = json_decode($users[$i]['Last_Position']);
			$userPos = [
				'lat' => $userPos[0],
				'lon' => $userPos[1]
			];

			$distance = distance($pos['lat'], $pos['lon'], $userPos['lat'], $userPos['lon']);


			// CREATE ARRAY OUTPUT

			$usersOut[$i] = [
				'ID' => $users[$i]['ID'],
				'ID_Soundcloud' => $users[$i]['ID_Soundcloud'],
				'Name' => $users[$i]['Name'],
				'Instrument_Favorit' => html_entity_decode($users[$i]['Instrument_Favorit']),
				'Instrument_Other' => $users[$i]['Instrument_Other'],
				'Style' => html_entity_decode($users[$i]['Style']),
				'Last_Position' => $users[$i]['Last_Position'],
				'First_Connection' => $users[$i]['First_Connection'],
				'Last_Connection' => $users[$i]['Last_Connection'],
				'Avatar' => $users[$i]['Avatar'],
				'Link_Soundcloud' => $users[$i]['Link_Soundcloud'],
				'Distance' => $distance
			];


		}


		usort($usersOut, 'sortByDistance');
		

		echo json_encode($usersOut);

	}

?>