(function(){
    var module = angular.module("messaging-app");
	/**
	 * @ngdoc controller
	 * @name messaging-app.controller:IndividualConversationController
	 * @requires messaging-app.service:MessengerService
	 * @requires $timeout
	 * @description Manages  ./views/messages/individual-conversation.html
	 */
    module.controller("IndividualConversationController", IndividualConversationController);
    IndividualConversationController.$inject = ["MessengerService", "$timeout","UserService"];
    function IndividualConversationController(MessengerService, $timeout, UserService) {
        var vm = this;
	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:IndividualConversationController#conversation
	     * @propertyOf messaging-app.controller:IndividualConversationController
	     * @description Contains the current conversation in the page.
	     */
	    vm.conversation = {};
	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:IndividualConversationController#noMessages
	     * @propertyOf messaging-app.controller:IndividualConversationController
	     * @description Flag to display "No messages" in case of an empty conversation
	     */
        vm.noMessages = true;
	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:IndividualConversationController#messageContent
	     * @propertyOf messaging-app.controller:IndividualConversationController
	     * @description Contains the new message contents
	     */
        vm.messageContent = "";
        /**
         * @ngdoc property
         * @name messaging-app.controller:IndividualConversationController#messageContent
         * @propertyOf messaging-app.controller:IndividualConversationController
         * @description Contains the new message contents
         */
        vm.messages = [];
        vm.sendMessage = sendMessage;
        vm.deleteConversation = deleteConversation;

        // Local variables
		let refFirebase = firebase.database().ref();
		let user = UserService.getUser();
        initController();
        //////////////////////////
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:IndividualConversationController#initController
	     * @methodOf messaging-app.controller:IndividualConversationController
	     * @description Initializes the controller
	     */
        function initController() {
            let naviParam = navi.getCurrentPage().options;
            if(naviParam)
			{
				vm.conversation = naviParam.param;
                refFirebase.child("messages"+"/"+vm.conversation.convId)
					.once("value",(snap)=>{
                	$timeout(()=>{
                		console.log("What");
                        if(snap.exists()) {
                        	vm.messages = Object.values(snap.val());
                        	console.log(vm.messages);

                        }
                    });
				});
                refFirebase.child("messages"+"/"+vm.conversation.convId)
					.on("child_added",function(snap){
						console.log(snap.val());
						$timeout(()=>{
                            if (snap.val()) vm.messages.push(snap.val());
                        });
                });
            }else{
            	ons.notification.alert({message:"Problem occurred fetching conversation"});
            	navi.resetToPage("./views/messages/conversations.html");
			}
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:IndividualConversationController#sendMessage
	     * @methodOf messaging-app.controller:IndividualConversationController
	     * @description Calls the MessengerService to add a message to the conversation array, updates vm.conversations
	     *              after.
	     */
        function sendMessage() {
        	console.log(vm.conversation, user);
        	MessengerService.sendMessage(vm.conversation.convId, user,
					vm.messageContent).catch((err)=>{
        			console.log(err);
					ons.notification.alert({message:"Problem connecting with server"});
			});
            vm.messageContent = "";
            vm.noMessages = false;
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:IndividualConversationController#deleteConversation
	     * @methodOf messaging-app.controller:IndividualConversationController
	     * @description Makes a call to {@link messaging-app.service:MessengerService#deleteConversation MessengerService} to
	     *              delete the current conversation in the page, if this fails, it displays an alert
	     *              otherwise, it pops the current page.
	     */
        function deleteConversation() {
            navi.popPage();
        	// var res = MessengerService.deleteConversation(vm.conversation.id);
        	// if(!res)
	        // {
		     //    ons.notification.alert({message: 'An error has occurred deleting conversation'});
	        // }else{
		     //
	        // }

        }
    }
})();