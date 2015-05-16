var myApp = angular.module('myApp', []);

myApp.controller("appCtrl", function($scope,$http){

	SC.initialize({
	client_id: "264899dc03321fc2b89e7ff4816d7122",
	redirect_uri: "http://localhost/_heaj/tfe-build/",
	});


	var $infoConnect = jQuery(".info-connect"),
		 $actionsContainer = jQuery(".actions-container"),
		 $formPostal = jQuery(".form-postal-code");	



	jQuery("#connectWithSoundCloud").click(function(){


		SC.connect(function(){

			SC.get('/me', function(me,error){

				if(!error)else{

					var toput = JSON.stringify(me);
					cookiePut('sc_user_cookie',toput);

					tryConnect();

				}

			})

		})

		var tryConnect = function(){

			/*
				Vérifier si user exist 
				& si on a déjà sa positon

				sinon get by geo base

				si refus dmd pos			

			*/

			$http.get('php/connect.php').
				success(function(data){
					if(data.do =='connection'){

						cookiePut('user', JSON.stringify(data.user));
						window.location.href = "esic.html";

					}else if(data.do =='inscription'){

						cookiePut('user', JSON.stringify(data.user));
						console.log('goTo inscription success page');

					}else{
						console.log('error happend while connection');
					}
				})

		}

	})




	function getUserPosition()



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

				// creat user visitor
				var user = {
					'Name':'Visitor',
					'Last_Position': userPosition
				}


				//
				//
				// EDIT FOR THE FUNCTION 
				//
				// >> return user 
				// 
				// 
				cookiePut('user',JSON.stringify(user));


				// window.location.href = "esic.html";

			}

			// Or if error
			var errorHandler = function(error){


				// show info 
				$infoConnect.html('Impossible de récupérer votre position..');


				// Ask user postal code to try to get his position
				setTimeout(function(){


					


				},10)

			}

			var option = {timeout:5000};

			navigator.geolocation.getCurrentPosition(getPosition, errorHandler, option );


		}else{

			getPositionByPostCode();

		}



		function getPositionByPostCode(){


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

						//
						//
						// EDIT FOR THE FUNCTION 
						//
						// + réactiver submit button 
						// 
						// 

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
											console.log(data);
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
									$postalResult.text('Une erreur est survenu, réessayer.')
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
									$postalResult.text('Une erreur est survenu, réessayer.')									
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

});