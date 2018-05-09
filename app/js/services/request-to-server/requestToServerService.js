(function(){
    var module = angular.module("messaging-app");

    module.service("RequestToServer", RequestToServer);

    RequestToServer.$inject = ["$q"];

    function RequestToServer($q) {
        var service = {
            sendRequestWithResponse: sendRequestWithResponse
        };
	    var user_conversations = {"conv_id":0,
		    conversations:[
			    {
				    "id":"0",
				    "image":"https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&h=350",
				    "lastMessage":"Welcome!",
				    "messageDate":"May 7th 2018 9:03 am",
				    "user_1":"Laurie Hendren",
				    "user_2":"David Herrera",
				    "messages":[{"messageContent":"Hello!","messageDate":"May 7th 2018 9:01 am","id":"1","from":"Laurie Hendren"},
					    {"messageContent":"Hey Laurie","messageDate":"May 7th 2018 9:02 am","id":"2","from":"David H"},
					    {"messageContent":"Welcome to Opal!","messageDate":"May 7th 2018 9:03 am","id":"3","from":"Laurie Hendren"}]
			    },
			    {
				    "id":"1",
				    "image":"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
				    "lastMessage":"Welcome =-D!",
				    "messageDate":"May 7th 2018 9:03 am",
				    "user_1":"John Kildea",
				    "user_2":"David Herrera",
				    "messages":[ {"messageContent":"Hello!","messageDate":"May 7th 2018 9:01 am","messageId":"0","from":"John Kildea"},
					    {"messageContent":"Hey John","messageDate":"May 7th 2018 9:02 am","messageId":"1","from":"John Kildea"},
					    {"messageContent":"Welcome to Opal!","messageDate":"May 7th 2018 9:03 am","messageId":"2","from":"David Herrera"}]
			    },
			    {
				    "id":"2",
				    "image":"https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg?auto=compress&cs=tinysrgb&h=350",
				    "lastMessage":"Welcome! ",
				    "messageDate":"May 7th 2018 9:03 am",
				    "user_1":"Tarek Hijal",
				    "user_2":"David Herrera",
				    "messages":[ {"messageContent":"Hello!","messageDate":"May 7th 2018 9:01 am","messageId":"0","from":"Tarek Hijal"},
					    {"messageContent":"Hey Tarek","messageDate":"May 7th 2018 9:02 am","messageId":"1","from":"David Herrera"},
					    {"messageContent":"Welcome to Opal!","messageDate":"May 7th 2018 9:03 am","messageId":"2","from":"Tarek Hijal"}]
			    }
		    ]};
        return service;


        ///////////////////////////////////////
        function sendRequestWithResponse(request,parameters) {
            // Fake server request
            return serverCall(request, parameters);
        }
        function serverCall(request, parameters)
        {
                switch(request){
                    case "GetConversations":
	                    var conversations = user_conversations[parameters.userId];
	                    deferred.resolve(conversations);
                        return conversations;
                    case "AddConversations":
                        var id = Object.keys(user_conversations).length;
                        parameters.username;
                        parameter.userimage;

                }


        }
    }
})();