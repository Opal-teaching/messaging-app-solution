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
    IndividualConversationController.$inject = ["MessengerService", "$timeout"];
    function IndividualConversationController(MessengerService, $timeout) {
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
        vm.sendMessage = sendMessage;
        vm.deleteConversation = deleteConversation;

        // Local variables
		let refFirebase = firebase.database();


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
                refFirebase.child("messages"+"/"+vm.conversation.convId).once("value",function(messages){
					vm.messages =messages;
				});
                refFirebase.child("messages"+"/"+naviParam.convId).on("child_added",function(snap){
					if (snap.val())
					{
                        vm.messages.push = snap.val();
					}else{
						vm.messages = [];
					}


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
        	MessengerService.sendMessage(vm.conversation.id, vm.messageContent);
	        vm.messageContent = "";
	        vm.noMessages = false;
	        // Get messages back from server
	        vm.conversation = MessengerService.getConversationById(vm.conversation.id);
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

        	var res = MessengerService.deleteConversation(vm.conversation.id);
        	if(!res)
	        {
		        ons.notification.alert({message: 'An error has occurred deleting conversation'});
	        }else{
		        navi.popPage();
	        }

        }
    }
})();