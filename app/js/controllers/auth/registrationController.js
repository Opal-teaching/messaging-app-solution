(function() {
	var module = angular.module('messaging-app');
	/**
	 * @ngdoc controller
	 * @name messaging-app.controller:RegistrationController
	 * @requires $timeout
	 * @requires $scope
	 * @description Manages  ./views/messages/conversations.html
	 */
	module.controller('RegistrationController', RegistrationController);

	RegistrationController.$inject = [ "UserService", "$timeout", "$scope", "$http"];

	function RegistrationController(UserService, $timeout, $scope, $http) {
		let vm = this;
		vm.email = "";
		vm.username = "";
		vm.password = "";
		vm.imageUrl = "";
        vm.firstname = "";
        vm.lastname = "";
        vm.registerUser = registerUser;


        //////////////////////////////////////////
		 /**
		 * @ngdoc method
		 * @name messaging-app.controller:RegistrationController#method_name
		 * @methodOf messaging-app.controller:RegistrationController
         * @param user
         * @param email
         * @param password
         * @param firstname
         * @param lastname
         * @param imageUrl
	  	 * @desc Registers user in Firebase, sets the user in the UserService, sets the user fields in firebase
         */
		function registerUser(user, email, password, firstname, lastname, imageUrl)
		{
			let invalidMessage = validateNonFirebaseFields(firstname, lastname, user);
			if(!invalidMessage)
			{
                getImageContents(imageUrl)
                    .then(contentImage =>{
                        $timeout(()=>{
                            vm.imageSrc = contentImage;
                            firebase.auth().createUserWithEmailAndPassword(email, password)
                                .then(function(credentials){
                                    let userId = credentials.user.uid;
                                    UserService.setUserAtRegistration(userId, user, email,firstname, lastname, contentImage)
                                        .then(()=>{
                                            ons.notification.confirm({
                                                message: "Successfull registered",
                                                buttonLabels:["Ok"],
                                                callback:()=>{
                                                }
                                            });
                                        });
                                }).catch(function(err){
                                console.log(err);
                                ons.notification.alert({message:err.message});
                            });
                        });
                    })
                    .catch(() => {
                        ons.notification.alert({message:"Please provide a valid image url!"})
                    });
            }else{
                ons.notification.alert({message:invalidMessage})

            }
		}
        /**
         * @ngdoc method
         * @name messaging-app.controller:RegistrationController#getImageContents
         * @methodOf messaging-app.controller:RegistrationController
         * @param imageUrl
		 * @returns {Promise} Promise with the contents of the image or error;
         */
		function getImageContents(imageUrl)
		{
			return fetch(imageUrl).then(response => {
				const reader = response.body.getReader();
				return new ReadableStream({
					start(controller) {
						return pump();
						function pump() {
							return reader.read().then(({ done, value }) => {
								// When no more data needs to be consumed, close the stream
								if (done) {
									controller.close();
									return;
								}
								// Enqueue the next data chunk into our target stream
								controller.enqueue(value);
								return pump();
							});
						}
					}
				})
			})	.then(stream => new Response(stream))
				.then(response => response.blob())
				.then(blob => URL.createObjectURL(blob));
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:RegistrationController#validateNonFirebaseFields
		 * @methodOf messaging-app.controller:RegistrationController
         * @param firstname
         * @param lastname
         * @param user
         * @returns {string|null} Returns an invalid string message or null if fields are valid
		 * @desc Method used to validate fields that Firebase does not validate.
         */
        function validateNonFirebaseFields(firstname="", lastname="", user=""){
            let invalidMessage = null;
            if(firstname  && firstname === "")
            {
                invalidMessage = "Invalid first name";
            }else if(lastname && lastname === "")
            {

                invalidMessage = "Invalid last name";
            }else if(user  && user === "")
            {
                invalidMessage = "Invalid username";
            }
			return invalidMessage;
		}
		/**
		 * @ngdoc event
		 * @name messaging-app.controller:RegistrationController#property_name
		 * @eventOf messaging-app.controller:RegistrationController
		 * @desc Upon destruction of controller, it clears fields
		 **/
		$scope.$on("$destroy",function(){

		});
	}

})();