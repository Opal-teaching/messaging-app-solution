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
        var refConversations = firebase.database().ref("conversations");
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


        return service;



	    ///////////////////////////////////////

	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#addConversation
	     * @methodOf messaging-app.service:MessengerService
  	     * @description Takes a name and an imageUrl, and adds a new conversation onto the conversations array.
	     * @param {string} convId ConversationId
		 * @param {string} user_conv User to start a conversation with
		 * @returns {Promise} Returns promise.
	     */
        function addConversation(convId, user_conv){
            let members = {};
            members[user_conv.userId] = true;
            members[UserService.getUser().userId] = true;

            let newConversation = {};
            newConversation[convId] = {
				convId: convId,
				members: members
            };
			return refConversations.update(newConversation)
				.then(()=>{
					return newConversation;
				});
        }
	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#getConversations
	     * @methodOf messaging-app.service:MessengerService
	     * @description Getter for the conversations array
	     * @returns {Array} conversations array.
	     */
        function getConversations() {
        	var deferred = $q.defer();
		    refDB.once("value",function(snap){
				if(snap.exists())
				{
					deferred.resolve(snap.val());
				}
		    }).catch(function(err){
				deferred.reject(err);
		    });
		    return deferred.promise;
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
		    var deferred = $q.defer();
		    if(typeof id === "undefined") deferred.reject("Invalid Parameter");
		    refDB.child(id).once("value",function(snap){
			    if(snap.exists())
			    {
				    deferred.resolve(snap.val());
			    }
		    }).catch(function(err){
			    deferred.reject(err);
		    });
		    return deferred.promise;
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
		    var deferred = $q.defer();
		    return deferred.promise;
            var messageDate = new Date();
            var msg_id = conversations[conversationId].messages.length;
            var message = {
	            "messageContent":messageContent,"messageDate":new Date(),"messageId":msg_id,"from":UserService.getUser()
            };

            var searchConv = conversations.filter(function(item){
            	return item.id === conversationId;
            });

			if(searchConv.length !== 1) {
				return false;
			}
		    refDB.child(conversationId+"/messages").push().catch(function(err){
			    deferred.reject(err);
		    });

			return true;
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