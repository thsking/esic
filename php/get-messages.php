<?php 

	require_once('sql-connect.php');
	require_once('functions.php');


	if(@$_GET['to']=='list' && @$_GET['userId']){

		$userId = htmlentities($_GET['userId']);


		// GET CONVERSATIONS

		$query = 'SELECT ID, ID_User_A, ID_User_B, ID_Last_Message, Nbr_Messages FROM conversations WHERE ID_User_A='.$userId.' OR ID_User_B='.$userId;

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$conversations = $stmt->fetchAll();

		// GET LAST MESSAGES OF ANNONCE

		if(count($conversations)>0){

			$conversationsOut = [];

			for($i=0;$i<count($conversations);$i++){


				// EPURE conversations
				$conversation = [
					'ID' => $conversations[$i]['ID'],
					'ID_User_A' => $conversations[$i]['ID_User_A'],
					'ID_User_B' => $conversations[$i]['ID_User_B'],
					'ID_Last_Message' => $conversations[$i]['ID_Last_Message'],
					'Nbr_Messages' => $conversations[$i]['Nbr_Messages']
				];


				// GET LAST MESSAGE

				// _ first get id other user

				if($conversations[$i]['ID_User_A']==$userId){
					$lastMsgUserId = $conversations[$i]['ID_User_B'];
				}else{
					$lastMsgUserId = $conversations[$i]['ID_User_A'];
				}




				$query = 'SELECT ID, ID_Conversations, ID_User_Send, Message, Vu, Date_Creation FROM messages WHERE ID_Conversations='.$conversations[$i]['ID'].' ORDER BY Date_Creation DESC LIMIT 1';

				$stmt = $bdd->prepare($query);
				$stmt->execute();

				$lastMsg = $stmt->fetchAll();


				$q = 'SELECT * FROM messages WHERE ID_Conversations="'.$conversations[$i]['ID'].'" AND ID_User_Received="'.$userId.'" AND Vu=0';

				$stmt = $bdd->prepare($q);
				$stmt->execute();

				$messagesUnread = $stmt->fetchAll();

				
				

				if(count($lastMsg)>0){
					
					$lastMsg[0]['Message'] = html_entity_decode($lastMsg[0]['Message']);

					// GET USERS INFOS
					$query = 'SELECT ID, Name, Avatar FROM users WHERE ID='.$lastMsgUserId.' LIMIT 1';

					$stmt = $bdd->prepare($query);
					$stmt->execute();

					$user = $stmt->fetchAll();

					$conversationsOut[count($conversationsOut)] = [
							'conversation' => $conversation,
							'last_message' => $lastMsg[0],
							'user' => $user[0],
							'messages_unread' => count($messagesUnread)
						];

				}

			}


			if(count($conversationsOut)>0){
				echo json_encode($conversationsOut);
			}

		}

	}




	elseif(@$_GET['to']='only' && @$_GET['conversId']!='' && @$_GET['userId']!='' && !isset($_GET['lastMsgId'])){

		$conversId = htmlentities($_GET['conversId']);
		$userId = htmlentities($_GET['userId']);


		// GET MESSAGES CONVERS

		$query = 'SELECT ID, ID_Conversations, ID_User_Send, ID_User_Received, Message, Date_Creation FROM messages WHERE ID_Conversations='.$conversId.' ORDER BY Date_Creation';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$messages = $stmt->fetchAll();

		

		// GET OTHER USER

		$otherUserFound = false;
		
		for($i=0;$i<count($messages);$i++){

			if( $messages[$i]['ID_User_Send']!=$userId && $messages[$i]['ID_User_Received'] == $userId){

				$otherUserId = $messages[$i]['ID_User_Send'];
				$otherUserFound = true;

			}elseif( $messages[$i]['ID_User_Send']==$userId && $messages[$i]['ID_User_Received'] != $userId ){

				$otherUserId = $messages[$i]['ID_User_Received'];
				$otherUserFound = true;		
			}
		}

		if($otherUserFound){
			$query = 'SELECT ID, Name FROM users WHERE ID='.$otherUserId.' LIMIT 1';

			$stmt = $bdd->prepare($query);
			$stmt->execute();

			$user = $stmt->fetchAll();	

		}

		if(count($messages)>0 && $otherUserFound){
			
			// ARRAY OUT 
			$messagesOut = [
				'messages' => $messages,
				'user' => $user
			];


			for($i=0;count($messagesOut['messages'])>$i;$i++){
				$messagesOut['messages'][$i]['Message'] = html_entity_decode($messagesOut['messages'][$i]['Message']);
			}

			echo json_encode($messagesOut);

		}
	}


	elseif(@$_GET['to']='only' && @$_GET['conversId']!='' && @$_GET['userId']!='' && @$_GET['refresh']=='true' && @$_GET['lastMsgId']!=''){

		$conversId = htmlentities($_GET['conversId']);
		$lastMsgId = htmlentities($_GET['lastMsgId']);
		$userId = htmlentities($_GET['userId']);



		// GET CONVERS INFO

		$query = 'SELECT * FROM conversations WHERE ID='.$conversId.' LIMIT 1';

		$stmt = $bdd->prepare($query);
		$stmt->execute();

		$message = $stmt->fetchAll();
		$message = $message[0];


		if($message['ID_Last_Message']!=$lastMsgId){

			$query = 'SELECT Date_Creation FROM messages WHERE ID='.$lastMsgId.' LIMIT 1';

			$stmt = $bdd->prepare($query);
			$stmt->execute();

			$lastMsg = $stmt->fetchAll();


			$query = 'SELECT * FROM messages WHERE ID_Conversations='.$conversId.' AND Date_Creation > '.$lastMsg[0]['Date_Creation'].' ORDER BY Date_Creation';

			$stmt = $bdd->prepare($query);
			$stmt->execute();

			$newsMsgs = $stmt->fetchAll();

			for($i=0;count($newsMsgs)>$i;$i++){
				$newsMsgs[$i]['Message'] = html_entity_decode($newsMsgs[$i]['Message']);
			}


			echo json_encode($newsMsgs);


		}

	}

?>