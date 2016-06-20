var init = {
	callBackA: function(action, label) {
		console.log('callBackA', arguments);
	},
	callBackB: function(action, label) {
		console.log('callBackB', arguments);
	}
};

function pageInit() {
	var iid, like, max, c;

	like = document.querySelector('like-it');
	max = 10000;
	c = 0;
	iid = setInterval(
		function() {
			c += 5;
			if (c >= max) {
				clearInterval(iid);
				return;
			}//end if

			if (like.addCallback) {
				clearInterval(iid);
				like.addCallback(init.callBackA);
				like.addCallback(init.callBackA);
				like.addCallback(init.callBackB);
				like.addCallback(init.callBackB);
				like.removeCallback(init.callBackB);
			}//end if
		}
	, 5);
}
/*programed by mei(李維翰), http://www.facebook.com/mei.studio.li*/