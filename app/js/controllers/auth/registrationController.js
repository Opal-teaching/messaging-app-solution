(()=>{
	const module = angular.module('messaging-app');
	/**
	 * @ngdoc controller
	 * @name messaging-app.controller:RegistrationController
	 * @requires $timeout
	 * @requires $scope
	 * @description Manages  ./views/auth/register-user.html
	 */
	module.controller('RegistrationController', RegistrationController);

	RegistrationController.$inject = [ "UserService", "$timeout"];

	function RegistrationController(UserService, $timeout) {
		let vm = this;
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:RegistrationController#email
		 * @propertyOf messaging-app.controller:RegistrationController
		 * @description Email for registration
		 */
		vm.email = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:RegistrationController#username
		 * @propertyOf messaging-app.controller:RegistrationController
		 * @description Username for registration
		 */
		vm.username = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:RegistrationController#password
		 * @propertyOf messaging-app.controller:RegistrationController
		 * @description Password for registration
		 */
		vm.password = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:RegistrationController#imageSrc
		 * @propertyOf messaging-app.controller:RegistrationController
		 * @description Image src string
		 */
		vm.imageSrc = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:RegistrationController#firstname
		 * @propertyOf messaging-app.controller:RegistrationController
		 * @description first name for registration
		 */
        vm.firstname = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:RegistrationController#lastname
		 * @propertyOf messaging-app.controller:RegistrationController
		 * @description Last name for registration
		 */
        vm.lastname = "";

        vm.registerUser = registerUser;


        //////////////////////////////////////////
		 /**
		 * @ngdoc method
		 * @name messaging-app.controller:RegistrationController#registerUser
		 * @methodOf messaging-app.controller:RegistrationController
         * @param {string} user Username for new user
         * @param {string} email Username for new user
         * @param {string} password Password for new user
         * @param {string} firstname Firstname for new user
         * @param {string} lastname Lastname for new user
         * @param {string} imageUrl Content of imageUrl for new user
	  	 * @desc Registers user in Firebase, sets the user in the UserService, sets the user fields in firebase,
		  *      it first downloads the image and converts it into a base64 string.
         */
		function registerUser(user="", email="", password="", firstname="", lastname="", imageUrl="")
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
                                    UserService.setUserAtRegistration(userId, user, email,
	                                    firstname, lastname, contentImage)
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
         * @param {string} imageUrl Url for image
		 * @returns {Promise} Promise with the contents of the image in base64 format or error;
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
				.then(blob => new Promise((resolve,reject)=>{
						let reader = new FileReader();
						reader.readAsDataURL(blob);
						reader.onloadend = function() {
							base64data = reader.result;
							base64data = base64data.substring(0,5) + "image/png;" + base64data.substring(6)
							resolve(base64data);
						}
					}
				));
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:RegistrationController#validateNonFirebaseFields
		 * @methodOf messaging-app.controller:RegistrationController
         * @param {string} firstname Firstname to be validated
         * @param {string} lastname Lastname to be validated
         * @param {string} user Username to be validated
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
	}

})();