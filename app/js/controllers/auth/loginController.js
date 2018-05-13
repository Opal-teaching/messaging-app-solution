(function() {
    let module = angular.module('messaging-app');
    module.controller('LoginController', LoginController);
    /**
     * @ngdoc controller
     * @name messaging-app.controller:LoginController
     * @requires messaging-app.service:UserService
     * @description Manages  ./views/messages/conversations.html
     */
    LoginController.$inject = [ "UserService"];

	function LoginController(UserService) {
		let vm = this;
		vm.email = "";
		vm.password = "";
		vm.login = login;

		/////////////////////////////////////////////

		function login(email, password) {
			console.log(email, password);
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then((credentials)=>{
                    let userId = credentials.user.uid;
					UserService.setAuthenticatedUser(userId) // the then claused will be caught in the config.js file
						.catch((err)=>{
							console.log(err);
							ons.notification.alert({message:"Problem reaching server, try again later"});
					});
                }).catch((err)=>{
	                ons.notification.alert({message:err.message});
			});
		}


	}

})();