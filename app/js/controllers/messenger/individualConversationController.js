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
    IndividualConversationController.$inject = ["MessengerService", "$timeout","UserService", "$scope"];
    function IndividualConversationController(MessengerService, $timeout, UserService, $scope) {
        var vm = this;
	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:IndividualConversationController#conversation
	     * @propertyOf messaging-app.controller:IndividualConversationController
	     * @description Contains the current conversation in the page.
	     */
	    vm.conversation = null;
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
        /**
         * @ngdoc property
         * @name messaging-app.controller:IndividualConversationController#user_conv
         * @propertyOf messaging-app.controller:IndividualConversationController
         * @description The other use involved in the conversation
         */
        vm.user_conv = {};
		// Controller API functions
        vm.sendMessage = sendMessage;
        vm.deleteConversation = deleteConversation;

        // Local variables
		let refFirebase = firebase.database().ref();
		let user = UserService.getUser();
		let convId = "";
        initController();
        //////////////////////////
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:IndividualConversationController#initController
	     * @methodOf messaging-app.controller:IndividualConversationController
	     * @description Initializes the controller, obtains conversation from navigator,
	     *              then listens to new messages being added to that conversation.
	     *              If error fetching conversation, it displays an alert.
	     */
        function initController() {
            let naviParam = navi.getCurrentPage().options;

            if(naviParam)
			{
				console.log(naviParam);
                if(naviParam.conversation)
				{
                    vm.conversation = naviParam.conversation;
                    convId = vm.conversation.convId;
                    vm.user_conv = vm.conversation.user;
                    addMessagesListener();
				}else{
                    vm.user_conv = naviParam.user_conv;
                    convId = naviParam.convId;
				}
            }else{

                ons.notification.alert({message:"Problem occurred fetching conversation"});
                navi.resetToPage("./views/messages/conversations.html");
            }
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:IndividualConversationController#sendMessage
	     * @methodOf messaging-app.controller:IndividualConversationController
	     * @description Calls the MessengerService to add a message, if error,
	     *              displays Onsen alert.
	     */
        function sendMessage(messageContent) {
        	if ( vm.conversation )
			{
                MessengerService.sendMessage(vm.conversation.convId, user,
                    messageContent).catch((err)=>{
                    ons.notification.alert({message:"Problem sending message"});
                });
            }else{
                MessengerService.addConversation(user, vm.user_conv, convId)
					.then((conv)=>{
                	vm.conversation = conv;
                    return MessengerService.sendMessage(conv.convId, user, messageContent);
                }).then((enf)=>{
                    addMessagesListener();
                }).catch((err)=>{
                	console.log(err);
                	ons.notification.alert({message:"Problem adding conversation"});
                });
            }

            vm.messageContent = "";
            vm.noMessages = false;
        }
        function addMessagesListener() {
            refFirebase.child("messages"+"/"+convId)
                .on("child_added",function(snap){
                    $timeout(()=>{
                        if (snap.val()) vm.messages.push(snap.val());
                    });
                });
		}
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:IndividualConversationController#deleteConversation
	     * @methodOf messaging-app.controller:IndividualConversationController
	     * @deprecated
	     * @description Makes a call to {@link messaging-app.service:MessengerService#deleteConversation MessengerService} to
	     *              delete the current conversation in the page, if this fails, it displays an alert
	     *              otherwise, it pops the current page.
	     */
        function deleteConversation() {
            navi.popPage();
        }

	    $scope.$on("$destroy",()=>{
	    	refFirebase.off();
	    });
    }
})();