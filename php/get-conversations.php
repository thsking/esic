<?php 

	require_once('sql-connect.php');
	require_once('functions.php');


	if(@$_GET['userAId']!='' && @$_GET['userBId']!= ''){


		$userAId = htmlentities($_GET['userAId']);
		$userBId = htmlentities($_GET['userBId']);

		// check if convers between this two user exist

		$q = "SELECT * FROM conversations WHERE ID_User_A='".$userAId."' AND ID_User_B='".$userBId."' OR  ID_User_A='".$userBId."' AND ID_User_B='".$userAId."' LIMIT 1";

		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$convers = $stmt->fetchAll();


		if(count($convers)>0){ // If this convers exist

			echo $convers[0]['ID'];

		}else{

			// Create new convers
			$q = 'INSERT INTO conversations (ID, ID_User_A, ID_User_B, Nbr_Messages, Date_Creation) VALUES(
				"", "'.$userAId.'", "'.$userBId.'", 0, "'.time().'")';
			$stmt = $bdd->prepare($q);
			$stmt->execute();

			
			// Get ID this convers
			$q = "SELECT * FROM conversations WHERE ID_User_A='".$userAId."' AND ID_User_B='".$userBId."' OR  ID_User_A='".$userBId."' AND ID_User_B='".$userAId."' LIMIT 1";

			$stmt = $bdd->prepare($q);
			$stmt->execute();

			$thisConvers = $stmt->fetchAll();
			
			echo $thisConvers[0]['ID'];

		}

	}

	if(@$_GET['to']=='otherUser' && @$_GET['conversId'] !='' && @$_GET['userId'] != ''){


		$conversId = htmlentities($_GET['conversId']);
		$userId = htmlentities($_GET['userId']);

		// GET CONVERSATION
		$q = "SELECT * FROM conversations WHERE ID=".$conversId." LIMIT 1";
		$stmt = $bdd->prepare($q);
		$stmt->execute();
		$convers = $stmt->fetchAll();


		// GET OTHER USER ID
		$otherUserFound = false;


		if(count($convers) > 0 ){	
			$convers = $convers[0];
			


			if( $convers['ID_User_A']!=$userId && $convers['ID_User_B'] == $userId){

				$otherUserId = $convers['ID_User_A'];
				$otherUserFound = true;

			}elseif( $convers['ID_User_A']==$userId && $convers['ID_User_B'] != $userId ){

				$otherUserId = $convers['ID_User_B'];
				$otherUserFound = true;		
			}



		}

		if(@$otherUserId!='' && $otherUserFound){


			$query = 'SELECT ID, Name FROM users WHERE ID='.$otherUserId.' LIMIT 1';

			$stmt = $bdd->prepare($query);
			$stmt->execute();

			$user = $stmt->fetchAll();	
			
			echo json_encode($user[0]);


		}

		// Message Conversations Vu

		$q = 'UPDATE messages SET Vu=1 WHERE ID_Conversations="'.$conversId.'" AND ID_User_Received="'.$userId.'"';
		$stmt = $bdd->prepare($q);
		$stmt->execute();

	}

?>