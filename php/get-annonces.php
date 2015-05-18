<?php 

	require_once("sql-connect.php");
	require_once("functions.php");
	require_once("encoding.php");
	use \ForceUTF8\Encoding;



	if(@$_GET['to']=='list' && @$_GET['pos'] != ''){


		// GET_ASKING POSITION

		$posReceived = json_decode(htmlentities($_GET['pos']));

		$pos = [
			'lat' => $posReceived[0],
			'lon' => $posReceived[1]
		];
		unset($posReceived);


		// GET ANNONCES

		$query = 'SELECT ID, ID_User, Instrument, Description, Style FROM annonces LIMIT 0,100';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$annonces = $stmt->fetchAll();



		// EXPLORE ANNONCE AND ADD USER_INFOS IF NEEDED

		$users = [
			0 => [
				'ID' => '007',
				'Last_Position' => 'DTC connard'
			]
		]; 

		$annoncesOut = [];

		for($i=0;$i<count($annonces);$i++){

			$userInUsers = false;

			// VERIFY IF WE ALREADY HAVE USER INFO OF THIS ANNONCE
			for($ii=0;$ii<count($users);$ii++){
				
				if(in_array($annonces[$i]['ID_User'], $users[$ii])){
					$userInUsers = true;
				}

			}

			// GET USER INFO IF WE DONT HAVE
			if(!$userInUsers){

				$query = 'SELECT ID, Last_Position FROM users WHERE ID="'.$annonces[$i]['ID_User'].'"';

				$stmt = $bdd->prepare($query);
				$stmt->execute();

				$user = $stmt->fetchAll();



				$users[count($users)] = [
					'ID' => $user[0]['ID'],
					'Last_Position' => $user[0]['Last_Position']
				];

			}

			

			// Find Index of $users of the user send the annonce

			$userAnnonceIndex = '';

			for($ii=0;$ii<count($users);$ii++){

				if($annonces[$i]['ID_User'] == $users[$ii]['ID']){
					$userAnnonceIndex = $ii;
				}

			}

			



			// Caclulate the distance between the user_asking and 
			// the user_annonce

			$userAnnoncePos = json_decode($users[$userAnnonceIndex]['Last_Position']);
			$userAnnoncePos = [
				'lat' => $userAnnoncePos[0],
				'lon' => $userAnnoncePos[1]
			];


			$distance = distance($pos['lat'], $pos['lon'], $userAnnoncePos['lat'], $userAnnoncePos['lon']);

			// Create the array to send
			$annoncesOut[$i] = [
				'ID' => $annonces[$i]['ID'],
				'ID_User' => $annonces[$i]['ID_User'],
				'Instrument' => Encoding::toUTF8($annonces[$i]['Instrument']),
				'Style' => Encoding::toUTF8($annonces[$i]['Style']),
				'Description' => Encoding::toUTF8($annonces[$i]['Description']),
				'Last_Position' => $users[$userAnnonceIndex]['Last_Position'],
				'Distance' => $distance
			];

		}



		usort($annoncesOut, 'sortByDistance');
		echo json_encode($annoncesOut);

	}




	elseif(@$_GET['to']=='list' && @$_GET['userId']!= '' && !isset($_GET['pos'])){

		$userId = htmlentities($_GET['userId']);

		$q = 'SELECT * FROM annonces WHERE ID_User='.$userId.' ORDER BY Date_Creation DESC';
		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$annonces = $stmt->fetchAll();

		if(count($annonces)>0){

			echo json_encode($annonces);

		}

	}


	elseif(@$_GET['to']=='only' && @$_GET['annonceId']!= '' && @$_GET['pos'] != ''){


		// GET_ASKING POSITION

		$posReceived = json_decode(htmlentities($_GET['pos']));

		$pos = [
			'lat' => $posReceived[0],
			'lon' => $posReceived[1]
		];
		unset($posReceived);




		// GET ANNONCES

		$annonceId = htmlentities($_GET['annonceId']);

		$query = 'SELECT * FROM annonces WHERE ID="'.$annonceId.'"';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$annonce = $stmt->fetchAll();



		// GET USER_Annonce Position

		$userAnnonceId = $annonce[0]['ID_User'];

		$query = 'SELECT ID, Last_Position FROM users WHERE ID="'.$userAnnonceId.'" LIMIT 0,1';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$user = $stmt->fetchAll();

		$userPos = json_decode($user[0]['Last_Position']);		
		$userPos = [
			'lat' => $userPos[0],
			'lon' => $userPos[1]
		];

		

		// Calculate the distance between user annonce and user_asked

		$distance = distance($pos['lat'], $pos['lon'], $userPos['lat'], $userPos['lon']);



		// Make the output array
		$annonceOut = [
			'ID' => $annonce[0]['ID'],
			'ID_User' => $annonce[0]['ID_User'],
			'Instrument' => $annonce[0]['Instrument'],
			'Style' => Encoding::toUTF8($annonce[0]['Style']),
			'Description' => Encoding::toUTF8($annonce[0]['Description']),
			'Last_Position' => $user[0]['Last_Position'],
			'Distance' => $distance
		];

		print_r(json_encode($annonceOut));


	}




	elseif(@$_GET['to']=='tri'){

		$arr = [
			0 => [
				'name' => "myname",
				'dist' => 32
				],
			1 => [
				'name' => 'secondName',
				'dist' => 64
				],
			2 => [
				'name' => 'triName',
				'dist' => 21
				]
		];

		print_r($arr);

		function sortByDistance($a, $b){
			return $a['distance'] - $b['distance'];
		}

		usort($arr, 'sortByDistance');

		echo '<br />';

		print_r($arr);
	}

?>