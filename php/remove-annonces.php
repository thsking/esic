<?php 

	require_once('sql-connect.php');
	require_once('functions.php');


	if(@$_GET['annonceId']!=''){

		$annonceId = htmlentities($_GET['annonceId']);


		// verify if user ask to delete is 
		// the same user post annonce

		// Get cookie of actual user
		$user = json_decode(cookieGet('user'));


		// get annonce user id
		$q = 'SELECT ID, ID_User FROM annonces WHERE ID='.$annonceId.' LIMIT 1';
		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$annonce = $stmt->fetchAll();

		if(count($annonce)>0){

			$annonce = $annonce[0];

			// check if actual userId & annonce user id ==
			if($user->ID == $annonce['ID_User']){

				try {
					$q = 'DELETE FROM annonces WHERE ID='.$annonceId;
					$stmt = $bdd->prepare($q);
					$stmt->execute();	
					echo 'Annonce sould be delete';				
				}catch(Execption $e){

				}

			}

		}


	}

?>