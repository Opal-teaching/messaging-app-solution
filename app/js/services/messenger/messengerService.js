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
	     * @type {!firebase.database.Reference}
	     */
        const refConversations = firebase.database().ref("conversations");
        const refMessages = firebase.database().ref("messages");
        const refUsers = firebase.database().ref("users");
        const user = UserService.getUser();
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
		 * @returns {!firebase.Promise<*>} Returns promise.
	     */
        function addConversation(user, user_conv, convId){
            let members = {};
            members[user_conv.userId] = true;
			console.log(UserService.getUser());
            members[UserService.getUser().userId] = true;
			console.log(members);
            let newConversation = {};
            newConversation[convId] = {
				convId: convId,
				members: members
            };
			return refConversations.update(newConversation)
				.then(()=>{
					const userConv = {};
					userConv[convId] = true;
					return refUsers.child(user.userId+"/conversations")
						.update(userConv).then(()=>{
                        return newConversation[convId];
					});
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
        	let promises = [];
			return UserService.getUserConversations()
				.then((conversations)=>{
					if(conversations)
					{
						Object.keys(conversations).forEach((convId)=>{
							promises.push(getConversationById(convId));
						});
					}else{
						return $q.resolve([]);
					}

					return $q.all(promises);
				})
	    }
	    /**
	     * @ngdoc method
	     * @name messaging-app.service:MessengerService#getConversationById
	     * @methodOf messaging-app.service:MessengerService
	     * @param {string|number} convId Conversation id
	     * @description Searches and returns a conversation based on an id
	     * @returns {Promise} conversation matching the id, or null when not found
	     */
	    function getConversationById(convId)
	    {
	    	let defer = $q.defer();
		   refConversations.child(convId).once("value",(snap)=>{

		   	// Get last message

		    // Get members
			let conversation = snap.val();
			let members = conversation.members;
			let membersPromises = [];
			Object.keys(members).forEach((userId)=>{
                membersPromises.push(UserService.getUserById(userId));
			});
			return $q.all(membersPromises).then((users)=>{
                let otherUser = {};
				users.forEach((mem)=>{
                    members[mem.userId] = mem;
					if(mem.userId !== user.userId ) otherUser = mem;
				});
				if(membersPromises.length === 1) conversation.user = user;
				else conversation.user = otherUser;
                conversation.members = members;
				defer.resolve(conversation);
			});
           }).catch((err)=>defer.reject(err));
		   return defer.promise;
	    }

        /**
         * @ngdoc method
         * @name messaging-app.service:MessengerService#sendMessage
         * @methodOf messaging-app.service:MessengerService
         * @param {string} conversationId Conversation id
         * @param {string} messageContent Conversation id
		 * @returns {!firebase.Promise<void>}
         * @description Adds a message to a conversation, to do this, it updates three references.
		 * 				The lastMessage in conversation,
         */
        function sendMessage(conversationId, user, messageContent) {
			console.log(conversationId);
            // Update three places, last message, conversaiton, and messages
            let messageId = refConversations.push().key;
            const message = {
            	"messageId":messageId,
                "messageContent":messageContent,
				"messageDate":firebase.database.ServerValue.TIMESTAMP,
                "from":{
            		"firstname": user.firstname,
					"lastname":user.lastname,
					"userId":user.userId,
					"username":user.username,
					"imageUrl":user.imageUrl
                }
            };
            const messageConvUpdate = {};
            messageConvUpdate[messageId] = true;
            const convUpdate = {
            	lastMessage: message,
				messages: messageConvUpdate
			};
            return refConversations.child(conversationId)
				.update(convUpdate) // Update conversation
				.then(()=>{
                    const convMessage = {};
                    convMessage[messageId] = message;
					return refMessages.child(conversationId).update(convMessage);
				}).then(()=>{
					return message;
				});
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