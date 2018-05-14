(function(){
    var module = angular.module("messaging-app");
    module.filter("orderByLastMessage" , orderByLastMessage);
	orderByLastMessage.$inject = [];

    function orderByLastMessage()
    {
	    /**
	     * @ngdoc filter
	     * @name messaging-app.filter:OrderByLastMessage
	     * @param {Array} list List of conversations
	     * @param {Boolean} reverse Flag to reverse list
	     * @description Orders conversations by lastMessage date
	     **/
        return function(list,reverse)
        {
			list.sort((conv,conv2)=>{
				if(!conv.lastMessage)
				{
					return (reverse)?1:-1;
				}else if(!conv2.lastMessage)
				{
					return (reverse)?-1:1;
				}else if (conv.lastMessage.messageDate < conv2.lastMessage.messageDate) {
					return (reverse)?1:-1;
				}
				if (conv.lastMessage.messageDate > conv2.lastMessage.messageDate) {
					return (reverse)?-1:1;
				}
				return 0;
			});
            return list;
        }
    }
})();