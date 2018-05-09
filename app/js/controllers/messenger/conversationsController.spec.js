describe('ConversationsController', function() {
	beforeEach(module('messaging-app'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('$scope.conversations', function() {
		it('Checks that the length of conversations is initialized to 0', function() {
			var $scope = {};
			var controller = $controller('ConversationsController', { $scope: $scope });
			$scope = controller;
			// $scope.conversations = [];
			// $scope.password = 'longerthaneightchars';
			// $scope.grade();
			expect($scope.conversations).toEqual([]);
		});
	});
});