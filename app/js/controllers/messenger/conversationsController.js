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
        var vm = this;
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
        $scope.orderByDate = orderByDate;
		vm.logout = logout;

		// local variables
		let user = UserService.getUser();
		let refUser = firebase.database().ref("users/"+user.userId);

        initController();



        ////////////////////////////////////////////
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#initController
	     * @methodOf messaging-app.controller:ConversationsController
	     * @description Initializes the controller and the scope variables
	     */
        function initController(){

			// if(user.conversations)
			// {
             //    MessengerService.getConversations().then((convs)=>{
             //        $timeout(()=>{
             //            console.log(convs);
             //            vm.conversations = convs;
             //        });
             //    }).catch((err)=>{
             //        console.log(err);
             //        ons.notification.alert({message:"Error occurred while fetching conversations"});
             //    });
			// }

	        // Initialize events
            refUser.child("conversations").on("child_added",(snap)=>{
            	if(snap.exists())
				{
					console.log(snap.key, snap.val());
					let convId = snap.key;
					MessengerService.getConversationById(convId)
						.then((conv)=>{
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

        function orderByDate(first,second){
        	console.log(first,second);
        	return first>second;
		}
        /**
        * @ngdoc method
        * @name module_name.type_angular:name_type#method_name
        * @methodOf module_name.type_angular:name_type
        * @param {*} param1 Desc param1
        * @returns {} Desc return
        * @desc metho_descrition
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
		    navi.off("postpop");
	    });
    }
})();
