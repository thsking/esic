var myApp = angular.module('myApp', []);
var log = [];

function clog(text){

	/*log[log.length] = text;

	jQuery("#devinfo").empty();

	var devinfo = "";

	for(var i = 0; i<log.length ; i++){
		devinfo += "<p>"+log[i]+"</p>";
	}

	jQuery("#devinfo").html(devinfo);*/

}



function juryConnect(){

	var juryUser = {"ID":"18","ID_Soundcloud":"88322507","Name":"thskingz","Last_Position":"[50.4619776,4.8572163999999995]","Avatar":"https://i1.sndcdn.com/avatars-000082793772-mfvrze-large.jpg"},
		sc_juryUser_cookie = {"id":88322507,"kind":"user","permalink":"thskingz","username":"thskingz","last_modified":"2015/06/04 15:13:37 +0000","uri":"https://api.soundcloud.com/users/88322507","permalink_url":"http://soundcloud.com/thskingz","avatar_url":"https://i1.sndcdn.com/avatars-000082793772-mfvrze-large.jpg","country":"Belgium","first_name":"","last_name":"","full_name":"","description":null,"city":"","discogs_name":null,"myspace_name":null,"website":null,"website_title":null,"online":false,"track_count":4,"playlist_count":0,"plan":"Free","public_favorites_count":1,"followers_count":2,"followings_count":3,"subscriptions":[],"upload_seconds_left":9884,"quota":{"unlimited_upload_quota":false,"upload_seconds_used":915,"upload_seconds_left":9884},"private_tracks_count":0,"private_playlists_count":0,"primary_email_confirmed":true,"locale":""};

	cookiePut('user', JSON.stringify(juryUser));
	cookiePut('sc_user_cookie',  JSON.stringify(sc_juryUser_cookie));


	window.location.href='esic.html';

}

function logout(){
	cookieRemove('user');
	cookieRemove('sc_user_cookie');
}

myApp.controller("appCtrl", function($scope,$http){
	var $infoConnect = jQuery(".info-connect"),
		 $actionsContainer = jQuery(".actions-container"),
		 $formPostal = jQuery(".form-postal-code");

	var redirection = {
		'connection' : 'esic.html',
		'inscription' : 'esic.html#/edit-profil'
	}





	jQuery("#connectWithSoundCloud").click(function(){


		clog('connect with soundcloud')

		// show info
		$actionsContainer.addClass("hide");
		$infoConnect.removeClass("hide");


		SC.connect(function(){

			SC.get('/me', function(me,error){

				if(!error){

					var toput = JSON.stringify(me);
					cookiePut('sc_user_cookie',toput);

					tryConnect();

					clog('get user with success');

				}else{
					clog('error get user');
					clog(error.message);
				}

				clog(me.username);

			})

		})

		var tryConnect = function(){

			clog('try connect');

			$http.get('php/check-users.php').
				success(function(data){

					if(data){

						clog('check php/user success .. Try connect User PHP')

						$http.get('php/connect.php').
							success(function(connectData){

								clog('Connect get data success');

								connectUserSoundcloud(connectData);
							}).
							error(function(){
								clog('Error get data Connect user');
								$infoConnect.text('Une erreur est survenu lors de la connection, réessayez. // 57')
							})


					}else{
						clog('User isnt register');
						getUserPosition('soundcloud');
					}

				}).
				error(function(){
					// getUserPosition('soundcloud');
					clog('Error check user php');
				})

		}

	})



	jQuery(".connect-hors-ligne-container a").click(function(e){

		
		// block a event
		e.preventDefault();


		// set vars
		var $infoConnect = jQuery(".info-connect"),
			$actionsContainer = jQuery(".actions-container"),
			$formPostal = jQuery(".form-postal-code");

		var inSearching = false;


		// show info
		$actionsContainer.addClass("hide");
		$infoConnect.removeClass("hide");


		getUserPosition('visitor');


	});

	function redirectTo(page){
		if(page=='connection'||page=='inscription'){
			window.location.href=redirection[page];
		}
	}


	function connectUserSoundcloud(data){

		if(data.do =='connection'){

			var user = {
				'ID':data.user['ID'],
				'ID_Soundcloud':data.user['ID_Soundcloud'],
				'Name':data.user['Name'],
				'Last_Position':data.user['Last_Position'],
				'Avatar':data.user['Avatar']
			}

			user = JSON.stringify(user);

			cookiePut('user', user);
			redirectTo('connection');

		}else if(data.do =='inscription'){


			var user = {
				'ID':data.user['ID'],
				'ID_Soundcloud':data.user['ID_Soundcloud'],
				'Name':data.user['Name'],
				'Last_Position':data.user['Last_Position'],
				'Avatar':data.user['Avatar']

			}

			user = JSON.stringify(user);

			cookiePut('user', user);
			redirectTo('connection');

		}else{
			console.log(data);
			$infoConnect.text('Une erreur est survenu lors de la connection, réessayez. // 145');
		}
	}

	function connectUser(method, geoMethod, data, error){



		if(method=='soundcloud'){

			
			var userPosition;

			if(geoMethod=='postal'){

				userPosition = data.results[0].geometry.location;

			}else{

				userPosition = data;

			}

			userPosition = [userPosition['lat'],userPosition['lon']];

			userPosition = JSON.stringify(userPosition);



			$http.get('php/connect.php?pos='+userPosition).
				success(function(data){

					connectUserSoundcloud(data);

				}).
				error(function(){
					$infoConnect.text('Une erreur est survenu lors la connection, réessayez. // 181')
				})



		}else if(method=='visitor'){
			
			var userPosition;

			if(geoMethod=='postal'){

				userPosition = data.results[0].geometry.location;

			}else{

				userPosition = data;

			}

			// creat user visitor
			var user = {
				'Name':'Visitor',
				'Last_Position': userPosition
			}

			user = JSON.stringify(user);
			cookiePut('user', user);

			redirectTo('connection');


		}

	}


	function getUserPosition(method){


		// test navigator geoloc
		if(navigator.geolocation){

			$infoConnect.html('Récupération de <br />votre position en cours..');

			// start searching.
			inSearching = true;


			// If we get position	
			var getPosition = function(position){

				var userPosition = {
					'lat': position.coords.latitude,
					'lon': position.coords.longitude
				};


				//
				//
				// EDIT FOR THE FUNCTION 
				//
				// >> return user 
				// 
				// 
				// cookiePut('user',JSON.stringify(user));
				console.log('getUserPostion(): ');
				console.log(userPosition);
				connectUser(method, 'nav', userPosition, 0);


				// window.location.href = "esic.html";

			}

			// Or if error
			var errorHandler = function(error){


				// show info 
				$infoConnect.html('Impossible de récupérer votre position..');


				// Ask user postal code to try to get his position
				setTimeout(function(){


					getPositionByPostCode(method);


				},2000)

			}

			var option = {timeout:5000};

			navigator.geolocation.getCurrentPosition(getPosition, errorHandler, option );


		}else{

			// show info 
			$infoConnect.html('Impossible de récupérer votre position..');


			// Ask user postal code to try to get his position
			setTimeout(function(){


				getPositionByPostCode(method);


			},2000)

		}


	}


	function getPositionByPostCode(method){


		// set var 
		$infoConnect.html("").addClass('hide');
		$formPostal.removeClass("hide");

		var $postalCode = jQuery(".form-postal-code .postal-code"), 
			 $postalResult = jQuery(".form-postal-code .postal-result"),
			 $submitBtn = jQuery(".form-postal-code .btn-submit");

		var valLastSearch = '', resultLastSearch = '';


		// when user keyup the postal code
		$postalCode.keyup(function(e){

			var thiss = $postalCode,
				 val = $postalCode.val();

			// if user postal code == 4 ( belgium postal code )
			if(val.length==4 ){

				// verify if it's not the same val that before
				// user hit 4 char
				if(val == valLastSearch){

					$postalResult.text(resultLastSearch);

				}else{

					// set the new val as the lastone for next time
					// to dont ask lot of time google
					valLastSearch = val;

					
					// set url google ask
					var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+val+'+Belgique';

					// try to get infos 
					$http.get(url).
						success(function(data){

							if(data.status=='OK'){

								// show to user result that we have
								$postalResult.text(data.results[0].formatted_address);
								resultLastSearch = data.results[0].formatted_address;	

								// on submit click
								$submitBtn.click(function(){

									// prevent submit if user delete some char
									var $this = jQuery(this);
									if(!$this.hasClass("blocked")){


										//
										//
										// EDIT FOR THE FUNCTION 
										//
										// >> return data 
										// 
										// 

										// set cookie visitor
										// return [data, 0];
										connectUser(method, 'postal', data, 0);
										/*
										console.log('getPositionByPostCode(): ')
										console.log(data);*/
									}

								})

							}else{
								//
								//
								// EDIT FOR THE FUNCTION 
								//
								// >> return error 
								// 
								// 
								// console.log('getPositionByPostCode(): ')
								// console.log('error');
								$postalResult.text('Une erreur est survenu, réessayer. // 57')
							}


						}).
						error(function(){
								//
								//
								// EDIT FOR THE FUNCTION 
								//
								// >> return error 
								// 
								// 
								// console.log('getPositionByPostCode(): ')
								// console.log('error');
								$postalResult.text('Une erreur est survenu, réessayer. // 57')								

						});

				}

				// enable the submit button
				$submitBtn.removeClass("blocked");

			}

			// desenable submit button and remove position get 
			// cause it will change when user'll put 4 char
			if(val.length!=4){
				$postalResult.html('&nbsp;');
				$submitBtn.addClass("blocked");
			}


		})


	} // end function getPositionByPostCode()

});