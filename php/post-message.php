<?php

	require_once('sql-connect.php');

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	

	@$msg = $request->msg;


	echo $msg.'<br /><br />';

	if(@$_GET['userId']!='' && @$_GET['conversId']!='' && isset($_GET['userId']) && @$msg!=''){
		
		$userId = htmlentities($_GET['userId']);
		$conversId = htmlentities($_GET['conversId']);
		$msg = htmlentities($msg);

		
		// GET OTHER USER ID 

		$q = 'SELECT ID_User_A, ID_User_B, ID_Last_Message, Nbr_Messages FROM conversations WHERE ID='.$conversId.' LIMIT 1';

		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$convers = $stmt->fetchAll();

		if(count($convers)>0){


			if( $convers[0]['ID_User_A']!=$userId && $convers[0]['ID_User_B']==$userId){
				$userReceivedId = $convers[0]['ID_User_A'];
			
			}elseif($convers[0]['ID_User_A']==$userId && $convers[0]['ID_User_B']!=$userId){
				$userReceivedId = $convers[0]['ID_User_B'];
			}

			if(@$userReceivedId!=''){
				
				// ADD MESSAGE				
				$q = "INSERT INTO messages (ID, ID_Conversations, ID_User_Send, ID_User_Received, Message, Date_Creation) VALUES ('', '".$conversId."', '".$userId."', '".$userReceivedId."',:msg , '".time()."')";
				$stmt = $bdd->prepare($q);

				try {
					$stmt->execute(array(':msg'=>$msg));
				}catch(Exception $e){

	        		die('Erreur : ' . $e->getMessage());

				}

				// ADD NOTIFICATION

				$q = 'SELECT * FROM notifications WHERE ID_Conversations="'.$conversId.'" AND ID_Received="'.$userReceivedId.'"';
				$stmt = $bdd->prepare($q);
				$stmt->execute();

				$notifs = $stmt->fetchAll();

				if(count($notifs)>0){

					if($notifs[0]['Vu']==1){
						$q = 'UPDATE notifications SET Vu=0 WHERE ID_Conversations='.$conversId.' AND ID_Received='.$userReceivedId;
						$stmt = $bdd->prepare($q);
						$stmt->execute();
					}

				}else{

					$q = "INSERT INTO notifications (ID, ID_Conversations, Vu, ID_Received) VALUES('', '".$conversId."', '0', '".$userReceivedId."')";
					$stmt= $bdd->prepare($q);
					$stmt->execute();

				}


				// EDIT CONVERS
				$q = "SELECT ID, ID_Conversations, Date_Creation, Message FROM messages WHERE ID_Conversations=".$conversId." ORDER BY Date_Creation";
				$stmt = $bdd->prepare($q);
				$stmt->execute();

				$convers = $stmt->fetchAll();

				$q = "SELECT * FROM messages WHERE ID_Conversations='".$conversId."' ORDER BY Date_Creation DESC";
				$stmt = $bdd->prepare($q);
				$stmt->execute();

				$lastMsgs = $stmt->fetchAll();
				
				$lastMsgId = $lastMsgs[0]['ID'];
				$nbr_msg = count($lastMsgs);

				$upd = 'UPDATE conversations SET ID_Last_Message="'.$lastMsgId.'", Nbr_Messages="'.$nbr_msg.'" WHERE ID = '.$conversId;
				$stmt = $bdd->prepare($upd);

				try {

					$stmt->execute();

				}catch(Exception $e){
	        		die('Erreur : ' . $e->getMessage());					
				}
			}
		}

	}

?>