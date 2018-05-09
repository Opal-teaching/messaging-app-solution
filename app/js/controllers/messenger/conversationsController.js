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

    ConversationsController.$inject = ["MessengerService","$timeout", "$scope"];
    function ConversationsController(MessengerService,$timeout, $scope){
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
	     * @name messaging-app.controller:ConversationsController#emptyConversations
	     * @propertyOf messaging-app.controller:ConversationsController
	     * @description Flag to determine when to show 'No message'
	     */
	    vm.emptyConversations = true;
	    /**
	     * @ngdoc property
	     * @name messaging-app.controller:ConversationsController#searchConversationString
	     * @propertyOf messaging-app.controller:ConversationsController
	     * @description String used to search conversations, it matches names
	     */
	    vm.searchConversationString = "";

	    vm.newConversation = newConversation;
        vm.goToConversation = goToConversation;

        initController();



        ////////////////////////////////////////////
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#initController
	     * @methodOf messaging-app.controller:ConversationsController
	     * @description Initializes the controller and the scope variables
	     */
        function initController(){
	        vm.conversations = MessengerService.getConversations();
	        vm.emptyConversations = (vm.conversations.length === 0);

	        // Initialize events
            initializeEvents();

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

            navi.pushPage("./views/messages/individual-conversation.html",{conversation:conversation});
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.controller:ConversationsController#initializeEvents
	     * @methodOf messaging-app.controller:ConversationsController
	     * @description Initializes navigator event to refresh conversations
	     */
        function initializeEvents() {
	        navi.on("postpop",function(event){
	            $timeout(function(){
		            vm.conversations = MessengerService.getConversations();
		            vm.emptyConversations = (vm.conversations.length === 0);
                });
	        });
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
