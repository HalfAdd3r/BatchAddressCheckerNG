// Default Chrome App Launcher
chrome.app.runtime.onLaunched.addListener(function(){
	chrome.app.window.create('window.html',{
		'bounds':{
			'width':940,
			'height':500
		}
	});
});

