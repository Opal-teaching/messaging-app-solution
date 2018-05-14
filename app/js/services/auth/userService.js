(function () {
	const module = angular.module("messaging-app");
	/**
	 * @ngdoc service
	 * @name messaging-app.service:UserService
	 * @requires $q
	 * @description User authentication information
	 */
	module.service("UserService",UserService);

	UserService.$inject = ["$q"];

	function UserService($q) {
		/**
		 * @ngdoc property
		 * @name messaging-app.service:UserService#user
		 * @propertyOf messaging-app.service:UserService
		 * @description Username
		 * @type {Object}
		 */
		let user = {};
		/**
		 * @ngdoc property
		 * @name messaging-app.service:UserService#refUsers
		 * @propertyOf messaging-app.service:UserService
		 * @description Reference to Firebase users
		 * @type {!firebase.database.Reference}
		 */
		let refUsers = firebase.database().ref("users");

		return {
			getUser: getUser,
            getUserFirebaseRef:getUserFirebaseRef,
            setUserAtRegistration:setUserAtRegistration,
            setAuthenticatedUser:setAuthenticatedUser,
            getUserById:getUserById,
			getUserConversations:getUserConversations,
            logout:logout
		};
		/////////////////

		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#getUser
		 * @methodOf messaging-app.service:UserService
		 * @description Getter for a local copy of the user
		 */
		function getUser() {
			return user;
        }

		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#getUserFirebaseRef
		 * @methodOf messaging-app.service:UserService
		 * @description Getter for the user reference in teh database
		 */
        function getUserFirebaseRef(){
            if(user.userId) {
            	return refUsers.child(user.userId);
            }else{
                logout();
            }
        }
		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#setUser
		 * @methodOf messaging-app.service:UserService
		 * @param {string} puserId  UserId for new user
		 * @param {string} puser  Username for new user
		 * @param {string} pemail Email for new user
		 * @param {string} pfirstname Firstname for new user
		 * @param {string} plastname Lastname for new user
		 * @param {string} pcontentImage Content of imageUrl for new user
		 * @description Adds the user to the database
		 * @returns {Promise} On success, registers the user correctly.
		 **/
		function setUserAtRegistration(puserId, puser, pemail, pfirstname, plastname, pcontentImage)
        {
	        authFlag = true;
			user = {
				userId: puserId,
				username: puser,
				email:pemail,
				firstname: pfirstname,
				lastname: plastname,
				imageUrl: pcontentImage
			};
            let userObject = {};
            userObject[puserId] = user;
			return refUsers.update(userObject);
		}

		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#setAuthenticatedUser
		 * @methodOf messaging-app.service:UserService
		 * @param {string} userId  Reference Id for user
		 * @description Gets user information and sets a local copy of the logged in user
		 * @returns {Promise} On success it returns the user.
		 **/
		function setAuthenticatedUser(userId)
		{
			let deferred = $q.defer();

            refUsers.child(userId)
				.once("value",(snap)=>{
					if(snap.exists())
					{
						user = snap.val();
						return refUsers.child(userId).update({online:true})
							.then(()=>deferred.resolve(user));
					}else{
						deferred.reject(new Error("Could not reach user"));
					}
			});
			return deferred.promise;
		}

		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#getUserById
		 * @methodOf messaging-app.service:UserService
		 * @param {string} userId  Reference Id for user
		 * @description Sets the user to be accessed by the application
		 * @returns {Promise} On success it returns the user.
		 **/
		function getUserById(userId)
		{
			let deferred = $q.defer();
			refUsers.child(userId)
				.once("value",(snap)=>{
					if(snap.exists()) deferred.resolve(snap.val());
				}).catch((err)=>{
                deferred.reject(err);
			});
			return deferred.promise;
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#getUserConversations
		 * @methodOf messaging-app.service:UserService
		 * @description Obtains the list of conversation references for the logged in user
		 * @returns {Promise} On success it returns the conversation references for the logged in user
		 **/
		function getUserConversations()
		{
			let deferred = $q.defer();
			refUsers.child(user.userId+"/conversations")
				.once("value",(snap)=>{
					if(snap.exists()) deferred.resolve(snap.val());
				}).catch((err)=>{
				deferred.reject(err);
			});
			return deferred.promise;
		}
		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#logout
		 * @methodOf messaging-app.service:UserService
		 * @description Logs user out, sets 'online' flag on user to false before.
		 **/
		function logout()
		{
			refUsers.child(user.userId).update({online:null});
			firebase.auth().signOut();
		}

	}
})();