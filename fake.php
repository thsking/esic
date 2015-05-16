<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>fakeMaker</title>
	<style>
		
		.pull-left {
			float:left;
			margin-right: 25px;
		}
		.clearfix:after {
			content: "";
			display: block;
			clear:both;
		}

	</style>
</head>
<body>

	<h1>Fake Maker</h1>
	
	<h2>Timestamp</h2>
	<p><?php echo time();?></p>




	<div class="clearfix">



		<div class="pull-left">
			
			<h2>Get Soundcloud info</h2>

			<p><input type="text" name="idSc" id="idSc"></p>

			<button id="getSc">Get User</button>

			<button id="getTrackSc">Get Track</button>

		</div>




		<div class="pull-left">
	
			<h2>Make Output</h2>

			<table class="makeCookie">
				
				<tr>
					<td>ID</td>
					<td><input type="text" name="id_sc" class="id"></td>
				</tr>
				<tr>
					<td>ID_Soundcloud</td>
					<td><input type="text" name="id_sc" class="id_sc"></td>
				</tr>
				<tr>
					<td>Name</td>
					<td><input type="text" name="name" class="name"></td>
				</tr>
				<tr>
					<td>Last_Position</td>
					<td><input type="text" name="last_position" class="last_position"></td>
				</tr>
				<tr>
					<td>Avatar</td>
					<td><input type="text" name="avatar" class="avatar"></td>
				</tr>
				<tr>
					<td>Link Sc</td>
					<td><input type="text" name="link_sc" class="link_sc"></td>
				</tr>
				<tr>
					<td>Connection time</td>
					<td><input type="text" name="time" class="time"></td>
				</tr>
				<tr>
					<td></td>
					<td><button id="makeCookie">MakeCookie</button></td>
				</tr>

			</table>

		</div>


	</div>

	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  	<script src="lib/quirksmode.js"></script>
  	<script src="http://connect.soundcloud.com/sdk.js"></script>

  	<script>


	    SC.initialize({
	        client_id: "264899dc03321fc2b89e7ff4816d7122",
	        redirect_uri: "http://localhost/_heaj/tfe-build/",
	    });

  		$(window).ready(function(){

  			$('#getSc').click(function(){

  				var $idSc = $('#idSc').val();

  				console.log($idSc);

  				SC.get('/users/'+$idSc, function(users, error){
  					if(!error){
  						console.log(users);
  					}else{
  						console.log(users);
  					}
  				})

  			})

  			$('#getTrackSc').click(function(){

  				var $idSc = $('#idSc').val();

  				console.log($idSc);

  				SC.get('/users/'+$idSc+'/tracks/', function(tracks, error){
  					if(!error){
  						console.log(tracks);
  					}else{
  						console.log(tracks);
  					}
  				})

  			})

  			$('#makeCookie').click(function(){




				var user = {
					'ID':$('.makeCookie .id').val(),
					'ID_Soundcloud':$('.makeCookie .id_sc').val(),
					'Name':$('.makeCookie .name').val(),
					'Last_Position':$('.makeCookie .last_position').val(),
					'Avatar':$('.makeCookie .avatar').val()
				}

				user = JSON.stringify(user);
				cookiePut('user', user);
				

  			})

  		})

  	</script>
	

</body>
</html>