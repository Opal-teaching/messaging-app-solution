(function(){
	/**
	 * @ngdoc service
	 * @name messaging-app.service:MessengerService
	 * @description Model for the chat application, manipulates the conversations array
	 */
    var module = angular.module("messaging-app");

    module.service("MessengerService", MessengerService);
    MessengerService.$inject = ["$q","UserService"];

    function MessengerService($q,UserService) {
	    /**
	     * @ngdoc property
	     * @name messaging-app.service:MessengerService#conversations
	     * @propertyOf messaging-app.service:MessengerService
	     * @description Contains the conversations of the messaging app for this particular user.
	     * @type {Array}
	     */
        var conversations = [];
	    /**
	     *
	     * @type {{addConversation: addConversation, getConversations: getConversations, getConversationMessages: getConversationMessages, getConversationsFromServer: getConversationsFromServer}}
	     */
	    var service = {
            addConversation: addConversation,
            getConversations: getConversations,
		    sendMessage:sendMessage,
		    deleteConversation:deleteConversation,
		    getConversationById:getConversationById
        };


		    // Initialize conversations with dummy data;;
	    conversations = [
		    {
			    "id":"0",
			    "imageUrl":"https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&h=350",
			    "lastMessage":{"messageContent":"Welcome to Opal!","messageDate":"May 7, 2018 9:03 am","messageId":"3","from":"Laurie Hendren"},
			    "user_1":"Laurie Hendren",
			    "user_2":"David Herrera",
			    "messages":[{"messageContent":"Hello!","messageDate":"May 7, 2018 9:01 am","messageId":"1","from":"Laurie Hendren"},
				    {"messageContent":"Hey Laurie","messageDate":"May 7, 2018 9:02 am","messageId":"2","from":"David H"},
				    {"messageContent":"Welcome to Opal!","messageDate":"May 7, 2018 9:03 am","messageId":"3","from":"Laurie Hendren"}]
		    },
		    {
			    "id":"1",
			    "imageUrl":"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
		        "lastMessage": {"messageContent":"Welcome to Opal!","messageDate":"May 7, 2018 9:03 am","messageId":"2","from":"David Herrera"},
	            "user_1": "John Kildea",
			    "user_2": "David Herrera",
			    "messages":[ {"messageContent":"Hello!","messageDate":"May 7, 2018 9:01 am","messageId":"0","from":"John Kildea"},
				    {"messageContent":"Hey John","messageDate":"May 7, 2018 9:02 am","messageId":"1","from":"John Kildea"},
				    {"messageContent":"Welcome to Opal!","messageDate":"May 7, 2018 9:03 am","messageId":"2","from":"John Kildea"}]
		    },
		    {
			    "id":"2",
			    "imageUrl":"https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg?auto=compress&cs=tinysrgb&h=350",
			    "lastMessage":{"messageContent":"Welcome to Opal!","messageDate":"May 7, 2018 9:03 am","messageId":"2","from":"Tarek Hijal"},
			    "user_1":"Tarek Hijal",
			    "user_2":"David Herrera",
			    "messages":[ {"messageContent":"Hello!","messageDate":"May 7, 2018 9:01 am","messageId":"0","from":"Tarek Hijal"},
				    {"messageContent":"Hey Tarek","messageDate":"May 7, 2018 9:02 am","messageId":"1","from":"David Herrera"},
				    {"messageContent":"Welcome to Opal!","messageDate":"May 7, 2018 9:03 am","messageId":"2","from":"Tarek Hijal"}]
		    }
	    ];

        return service;



	    ///////////////////////////////////////

	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#addConversation
	     * @methodOf messaging-app.service:MessengerService
  	     * @description Takes a name and an imageUrl, and adds a new conversation onto the conversations array.
	     * @param {string} name Name of person in the conversation
	     * @param {string} imageUrl Url of image
	     */
        function addConversation(name, imageUrl){
            if(typeof name === "string" && name.length> 0
	            && typeof imageUrl === "string" && imageUrl.length> 0)
            var id = conversations.length;
            var newConversation = {
				id: id,
	            user_1: name,
	            user_2: UserService.getUser(),
	            imageUrl: imageUrl,
	            lastMessage: null,
	            messageDate: null,
	            messages: []
            };

            conversations.push(newConversation);
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#getConversations
	     * @methodOf messaging-app.service:MessengerService
	     * @description Getter for the conversations array
	     * @returns {Array} conversations array.
	     */
        function getConversations() {
        	return conversations;
	    }
	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#getConversationById
	     * @methodOf messaging-app.service:MessengerService
	     * @param {string|number} id Conversation id
	     * @description Searches and returns a conversation based on an id
	     * @returns {Object|null} conversation matching the id, or null when not found
	     */
	    function getConversationById(id)
	    {
	    	var results =  conversations.filter(function(conv){return conv.id === id});
	    	if(results.length !== 1) return null;

	    	return results[0];
	    }

	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#sendMessage
	     * @methodOf messaging-app.service:MessengerService
	     * @param {string} conversationId Conversation id
  	     * @param {string} messageContent Conversation id
	     * @description Adds a message to a conversation.
	     */
        function sendMessage(conversationId, messageContent) {
            var messageDate = new Date();
            var msg_id = conversations[conversationId].messages.length;
            var message = {
	            "messageContent":messageContent,"messageDate":new Date(),"messageId":msg_id,"from":UserService.getUser()
            };
	        conversations[conversationId].lastMessage = message;
			conversations[conversationId].messages.push(message);
			return 1;
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#deleteConversation
	     * @methodOf messaging-app.service:MessengerService
	     * @param {string} conversationId Conversation id
	     * @description Deletes conversation from the user's conversations
	     * @returns {boolean} Returns a success or failure flag
	     */
        function deleteConversation(conversationId){
            var indexDelete = conversations.findIndex(function(element){
				if(element.id === conversationId) {

					return true;
				}
				return false;
            });
            if(indexDelete !== -1) {
            	conversations.splice(indexDelete,1);
            	return true;
            }else{
            	return false;
            }
        }
    }
})();