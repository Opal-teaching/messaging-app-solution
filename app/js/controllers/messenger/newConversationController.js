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
		function initController()
		{

			refUsers.once("value",(snap)=>{
				$timeout(()=>{
					vm.loading = false;
					if(snap.exists())
					{
						vm.users = snap.val();
					}
				});
			});
			refUsers.on("child_changed",(snap)=>{
				$timeout(()=>{
					vm.loading = false;
					if(snap.exists())
					{
						let user = snap.val();
						vm.users[user.userId] = user;
					}
				});
			});
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:NewConversationController#createConversation
		 * @methodOf messaging-app.controller:NewConversationController
		 * @description Calls {@link  messaging-app.service:MessengerService#addConversation
		 * 						MessengerService.addConversation}
		 *              to add a conversation for the user
		 */
		function goToConversation(user_convId, user_conv){
			// Check whether conversation exists, if it does. pop this page
           // referenceUser.child("conversations").orderByKey();
			console.log(user_convId);

			let convId = (user_conv.userId < user.userId)? user_convId+user.userId: user.userId + user_convId;
			refConversations.child(convId).once("value",function(snap){
					if(snap.exists())
					{
						console.log(navi.getPages());
						navi.replacePage("./views/messages/individual-conversation.html",
							{param: snap.val(), animation:"lift"});
					}else{
						MessengerService.addConversation(user, user_conv, convId).then((conv)=>{
							console.log(conv);
                            navi.replacePage("./views/messages/individual-conversation.html",
								{param: conv, animation:"lift"});
						}).catch(()=>{
							ons.notification.alert({message:"Problem adding conversation"});
						});
					}
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