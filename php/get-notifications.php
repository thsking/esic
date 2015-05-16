<?php

	require_once('sql-connect.php');


	if(@$_GET['userId']!=''){


		$userId = htmlentities($_GET['userId']);

		$q = "SELECT * FROM notifications WHERE ID_Received='".$userId."' AND Vu=0";
		$stmt = $bdd->prepare($q);
		$stmt->execute();

		$notifs = $stmt->fetchAll();

		if(count($notifs)>0){
			echo count($notifs);
		}

	}

?>