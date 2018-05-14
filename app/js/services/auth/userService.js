(function () {
	const module = angular.module("messaging-app");
	/**
	 * @ngdoc service
	 * @name messaging-app.service:UserService
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
		let authFlag = false;

		let refUsers = firebase.database().ref("users");

		return {
			getUser: getUser,
            getUserFirebaseRef:getUserFirebaseRef,
            setUserAtRegistration:setUserAtRegistration,
            setAuthenticatedUser:setAuthenticatedUser,
            getUserById:getUserById,
            logout:logout
		};
		/////////////////

		/**
		 * @ngdoc method
		 * @name messaging-app.service:UserService#getUser
		 * @methodOf messaging-app.service:UserService
		 * @description Getter for the Username
		 */
		function getUser() {
			return user;
        }

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
         * @param puserId
         * @param puser
         * @param pemail
         * @param pfirstname
         * @param plastname
         * @param pcontentImage
		 * @description Sets the user to be accessed by the application
         * @returns {Promise}
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
		function logout()
		{
			firebase.auth().signOut();
		}

	}
})();