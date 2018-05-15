(function(){
	var module = angular.module("messaging-app");
	/**
	 * @ngdoc controller
	 * @name messaging-app.controller:NewConversationController
	 * @requires messaging-app.service:MessengerService
	 * @requires $timeout
	 * @requires $scope
	 * @description Manages  ./views/messages/new-conversation.html
	 */
	module.controller("NewConversationController", NewConversationController);
	NewConversationController.$inject = ["MessengerService", "UserService","$timeout", "$scope"];
	function NewConversationController(MessengerService, UserService,  $timeout, $scope){
		let vm = this;
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:NewConversationController#imageUrl
		 * @propertyOf messaging-app.controller:NewConversationController
		 * @description Url for person in new conversation
		 */
		vm.imageUrl = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:NewConversationController#name
		 * @propertyOf messaging-app.controller:NewConversationController
		 * @description Name for person in new conversation
		 */
		vm.name = "";
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:NewConversationController#users
		 * @propertyOf messaging-app.controller:NewConversationController
		 * @description Users array
		 */
		vm.users = [];

		/**
		 * @ngdoc property
		 * @name messaging-app.controller:NewConversationController#loading
		 * @propertyOf messaging-app.controller:NewConversationController
		 * @description When the users array is loading, this flag controls the UI loading.
		 */
		vm.loading = true;
		/**
		 * @ngdoc property
		 * @name messaging-app.controller:NewConversationController#searchUserStr
		 * @propertyOf messaging-app.controller:NewConversationController
		 * @description Variable use to filter list of users in UI
		 */
		vm.searchUserStr = "";
		vm.checkFields = checkFields;
		vm.goToConversation = goToConversation;

		// local variables
		let refUsers = firebase.database().ref("users");
		let refConversations = firebase.database().ref("conversations");
		let referenceUser = UserService.getUserFirebaseRef();
		let user = UserService.getUser();
		initController();
		///////////////////////////////
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:NewConversationController#initController
		 * @methodOf messaging-app.controller:NewConversationController
		 * @description Sets up listener to users in list, by first setting a
		 *              once firebase event to instantiate and then using a child_changed
		 *              event to get up to date with new users that may join.
		 */
		function initController()
		{

			refUsers.once("value",(snap)=>{
				$timeout(()=>{
					vm.loading = false;
					if(snap.exists()) vm.users = Object.values(snap.val());
				});
			});
			refUsers.on("child_changed",(snap)=>{
				$timeout(()=>{
					vm.loading = false;
					if(snap.exists())
					{
						let user = snap.val();
						vm.users.push(user);
					}
				});
			});
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:NewConversationController#createConversation
		 * @methodOf messaging-app.controller:NewConversationController
		 * @description Checks Firebase reference to see if the conversation exists, if it does,
		 *              it fetches the conversation, else, it calls {@link  messaging-app.service:MessengerService#addConversation
		 * 						MessengerService.addConversation}, it then pushes the
		 *
		 */
		function goToConversation(user_conv){
			// Check whether conversation exists, if it does. pop this page
			let convId = (user_conv.userId < user.userId)? user_conv.userId+user.userId: user.userId + user_conv.userId;
			console.log(convId);
			MessengerService.getConversationById(convId)
				.then((conv)=>{
					console.log(conv);
					if(conv)
					{
                        navi.replacePage("./views/messages/individual-conversation.html",
                            {conversation:conv, user_conv: user_conv, convId: convId,  animation:"lift"});
					}else{
						console.log("What");
                        navi.replacePage("./views/messages/individual-conversation.html",
                            {conversation: null,user_conv: user_conv, convId: convId, animation:"lift"});
					}
				}).catch((err)=>{
						console.log(err);
						ons.notification.alert({message:"Problem creating conversation"});
			});
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:NewConversationController#checkFields
		 * @methodOf messaging-app.controller:NewConversationController
		 * @description Checks fields for ngDisabled property of the submit button
		 */
		function checkFields() {
			return vm.imageUrl === "" || vm.name === "";
		}

		$scope.$on("$destroy",()=>{
			refConversations.off();
			refUsers.off();
		});
	}
})();