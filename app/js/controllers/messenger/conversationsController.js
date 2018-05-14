(function(){
    var module = angular.module('messaging-app');
	/**
	 * @ngdoc controller
	 * @name messaging-app.controller:ConversationsController
	 * @requires messaging-app.service:MessengerService
	 * @requires $timeout
	 * @requires $scope
	 * @description Manages  ./views/messages/conversations.html
	 */
    module.controller('ConversationsController', ConversationsController);

    ConversationsController.$inject = ["MessengerService","$timeout", "$scope", "UserService"];
    function ConversationsController(MessengerService,$timeout, $scope, UserService){
        let vm = this;
	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:ConversationsController#conversations
	     * @propertyOf messaging-app.controller:ConversationsController
	     * @description Contains array of conversations
	     */
        vm.conversations = [];

	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:ConversationsController#searchConversationString
	     * @propertyOf messaging-app.controller:ConversationsController
	     * @description String used to search conversations, it matches names
	     */
	    vm.searchConversationString = "";

	    vm.newConversation = newConversation;
        vm.goToConversation = goToConversation;
		vm.logout = logout;

		// local variables
		let user = UserService.getUser();
		let refUser = firebase.database().ref("users");
		let refConversations = firebase.database().ref("conversations");
        initController();



        ////////////////////////////////////////////
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#initController
	     * @methodOf messaging-app.controller:ConversationsController
	     * @description Initializes the controller and the scope variables
	     */
        function initController(){

	        refUser.child(user.userId+"/conversations").on("child_added",(snap)=>{
            	if(snap.exists())
				{
					console.log(snap.key, snap.val());
					let convId = snap.key;
					MessengerService.getConversationById(convId)
						.then((conv)=>{
							addConversationListeners(conv);
							addOnlineListeners(conv);
							$timeout(()=>{
								vm.conversations.push(conv);
							});
						}).catch((err)=>{
							console.log(err);
					});
				}
	        });
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#newConversation
	     * @methodOf messaging-app.controller:ConversationsController
	     * @description Pushes the new-conversation.html page onto the stack using a 'lift' animation
	     */
	    function newConversation() {
            navi.pushPage("./views/messages/new-conversation.html",{"animation":"lift"});
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#goToConversation
	     * @methodOf messaging-app.controller:ConversationsController
	     * @description Pushes the new-conversation.html page onto the stack with the selected
	     *              conversation as parameter
	     */
        function goToConversation(conversation) {
            navi.pushPage("./views/messages/individual-conversation.html",{param: conversation});
        }
		/**
		 * @ngdoc method
		 * @name messaging-app.controller:ConversationsController#addConversationListeners
		 * @methodOf messaging-app.controller:ConversationsController
	     * @param {Object} conv Conversation to be listened to
	     * @description Sets the listeners on the lastMessage of every conversation for this user.
	     */
        function addConversationListeners(conv){

            refConversations.child(conv.convId+"/lastMessage").on("value",(snap)=>{
            	if(snap.exists())
	            {
	            	$timeout(()=>{
			            vm.conversations = vm.conversations.map((convTemp)=>{
				            if(convTemp.convId === conv.convId) convTemp.lastMessage = snap.val();
				            return convTemp;
			            });
		            });
	            }
            });
		}
		/**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#addOnlineListeners
		 * @methodOf messaging-app.controller:ConversationsController
		 * @param {Object} conv Conversation to be listened to
	     * @description Sets the listeners on the online status of every user conversation.
	     */
	    function addOnlineListeners(conv){
		    refUser.child(conv.user.userId+"/online").on("value",(snap)=>{
				    $timeout(()=>{
					    vm.conversations = vm.conversations.map((convTemp)=>{
						    if(convTemp.convId === conv.convId) convTemp.user.online = snap.val();
						    return convTemp;
					    });
				    });
		    });
	    }
	    /**
        * @ngdoc method
        * @name messaging-app.controller:ConversationsController#logout
        * @methodOf messaging-app.controller:ConversationsController
        * @description Logs the user out of the application by calling {@link messaging-app.service:UserService#logout}
        **/
        function logout(){
        	UserService.logout();
		}
	    /**
	     * @ngdoc event
	     * @name messaging-app.controller:ConversationsController#$destroy
	     * @eventOf messaging-app.controller:ConversationsController
	     * @description Listens to the controller destruction and kills event listeners.
	     */
        $scope.$on('$destroy', function() {
		    refConversations.off();
		    refUser.off();
	    });
    }
})();
