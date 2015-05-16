<?php 

	header('Content-Type: text/html; charset=utf-8');

	require_once('sql-connect.php');
	require_once('functions.php');


	$sc_user_cookie = json_decode(@$_COOKIE['sc_user_cookie']);



	if(count($sc_user_cookie)==1){

		$error = true;
		$msgOut = '';

		$sc_user = [
			'ID' => $sc_user_cookie->id,
			'Name' => $sc_user_cookie->username,
			'Avatar' => $sc_user_cookie->avatar_url,
			'Link' => $sc_user_cookie->permalink_url
		];

		
		// CHECK IF USER ALREADY EXIST
		$q = 'SELECT * FROM users WHERE ID_Soundcloud='.$sc_user['ID'].' LIMIT 1';
		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$user=$stmt->fetchAll();


		// IF USER ALREADY EXIST
		if(count($user)>0){

			$user=$user[0];	

			// Update user info if needed
			checkAndUpdateUserInfo($user['Name'],$sc_user['Name'], 'Name', $user['ID'], $bdd);
			checkAndUpdateUserInfo($user['Avatar'],$sc_user['Avatar'], 'Avatar', $user['ID'], $bdd);
			checkAndUpdateUserInfo($user['Link_Soundcloud'],$sc_user['Link'], 'Link_Soundcloud', $user['ID'], $bdd);
			checkAndUpdateUserInfo($user['Instrument_Favorit'], 'Voix', 'Instrument_Favorit', $user['ID'], $bdd);

			if(@$_GET['pos']!=''){

				$pos = htmlentities($_GET['pos'])	;

				$q = "UPDATE users SET Last_Position = '".$pos."' WHERE ID=".$user['ID'];
				$stmt = $bdd->prepare($q);
				$stmt->execute();



			}



			// Create User Session

			// - Get last user info
			$q = 'SELECT * FROM users WHERE ID='.$user['ID'].' LIMIT 1';
			$stmt = $bdd->prepare($q);
			$stmt->execute();

			$user = $stmt->fetchAll();
			$user = $user[0];

			

			// make output

			$error=false;
			$msgOut = [
				'do' => 'connection',
				'user' => $user
				];


		}else{

			if(@$_GET['pos']!=''){

				$pos = $_GET['pos'];

				// CREAT NEW USER
				$q = "INSERT INTO users (ID, ID_Soundcloud, Name, Last_Position, First_Connection, Last_Connection, Avatar, Link_Soundcloud) 
				VALUES ('', '".$sc_user['ID']."', '".$sc_user['Name']."', '".$pos."', '".time()."', '".time()."', '".$sc_user['Avatar']."', '".$sc_user['Link']."')";

				$stmt = $bdd->prepare($q);

				try {
					$stmt->execute();				
				}catch(Exception $e){

	        		die('Erreur : ' . $e->getMessage());

				}

				// CREATE USER SESSION
				$q = 'SELECT * FROM users WHERE ID_Soundcloud='.$sc_user['ID'].' LIMIT 1';
				$stmt=$bdd->prepare($q);
				$stmt->execute();

				$user = $stmt->fetchAll();
				$user = $user[0];


				// make output
				
				$error=false;
				$msgOut = [
					'do' => 'inscription',
					'user' => $user
					];

			}else{$error=true;}

		}

		if($error){
			echo 'error';
		}else{  
			echo json_encode($msgOut);
		}

	}else{
		echo 'error';
	}





?>