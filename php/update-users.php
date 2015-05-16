<?php 


	require_once('sql-connect.php');
	require_once('functions.php');


	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);


	@$user = $request->instrument_favorit;

	$user = [
		'Instrument_Favorit' => htmlentities(@$request->instrument_favorit),
		'Style' => htmlentities(@$request->style),
		'Description' => htmlentities(@$request->description),
		'Link_Twitter' => htmlentities(@$request->link_twitter),
		'Link_Facebook' => htmlentities(@$request->link_facebook)
	];


	if(@$_GET['userId']!=''){

		$userId = htmlentities($_GET['userId']);

		// get old user info
		$q = 'SELECT * FROM users WHERE ID='.$userId.' LIMIT 1';

		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$userOld = $stmt->fetch();


		if(count($userOld)>0){  


			checkAndUpdateUserInfo($userOld['Instrument_Favorit'], $user['Instrument_Favorit'], 'Instrument_Favorit', $userId, $bdd);
			checkAndUpdateUserInfo($userOld['Style'], $user['Style'], 'Style', $userId, $bdd);
			checkAndUpdateUserInfo($userOld['Description'], $user['Description'], 'Description', $userId, $bdd);
			checkAndUpdateUserInfo($userOld['Link_Twitter'], $user['Link_Twitter'], 'Link_Twitter', $userId, $bdd);
			checkAndUpdateUserInfo($userOld['Link_Facebook'], $user['Link_Facebook'], 'Link_Facebook', $userId, $bdd);

			echo 'checkUp done -- <br />';

		}





	}
?>