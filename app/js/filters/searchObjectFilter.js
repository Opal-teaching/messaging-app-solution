(function(){
	const module = angular.module("messaging-app");
	module.filter('filterObject', function() {
		return function(input, search) {
			if (!input) return input;
			if (!search) return input;
			var expected = ('' + search).toLowerCase();
			var result = {};
			angular.forEach(input, function(user, key) {
				angular.forEach(user, function(value, key) {
					var actual = ('' + value).toLowerCase();
					if (actual.indexOf(expected) !== -1 && !result.hasOwnProperty(key)) {
						result[key] = user;
					}
				});
			});
			return result;
		}
	});
})();
