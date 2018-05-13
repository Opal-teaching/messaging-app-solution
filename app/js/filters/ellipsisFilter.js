
(function(){
	var module = angular.module('messaging-app');
	/**
	 * @ngdoc filter
	 * @name messaging-app.filter:ellipsis
	 * @param {string} text Text to be processed
  	 * @param {string|number} maxLength Maximum length of text
	 * @returns {function} Returns function transformation
	 * @description If the text is larger than maxLength,
	 *              shortened to maxLength and apply ellipsis
	 */
	module.filter("ellipsis", EllipsisFilter);

	EllipsisFilter.$inject = [];

	function EllipsisFilter()
	{
		return function (text, maxLength)
		{
			maxLength = Number(maxLength);
			if(typeof text !== 'string' || isNaN(maxLength)) return text;
			if(text.length > maxLength)
			{
				var tempText = text.substring(0, maxLength);
				return tempText+"...";
			}
		}
	}
})();





