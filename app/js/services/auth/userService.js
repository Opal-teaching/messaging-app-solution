(function () {
	var module = angular.module("messaging-app");
	/**
	 * @ngdoc service
	 * @name messaging-app.service:UserService
	 * @description User authentication information
	 */
	module.service("UserService",UserService);

	UserService.$inject = [];

	function UserService() {
		/**
		 * @ngdoc property
		 * @name messaging-app.service:UserService#user
		 * @propertyOf messaging-app.service:UserService
		 * @description Username
		 * @type {string}
		 */
		var user = "David Herrera";
		return {
			getUser: getUser
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

	}
})();