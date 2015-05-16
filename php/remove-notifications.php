<?php

	require_once('sql-connect.php');
	require_once('functions.php');


	if(@$_GET['userId']!=''){

		$userId = htmlentities($_GET['userId']);

		$q = "UPDATE notifications SET Vu=1 WHERE ID_Received='".$userId."'";
		$stmt = $bdd->prepare($q);
		$stmt->execute();		

	}


?>