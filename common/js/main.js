// service workerが有効なら、sw.jsを登録
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/pwa-sample/common/js/sw.js').then(function(reg) {

		if(reg.installing) {
			console.log('Service worker installing');
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active. Scope is ' + reg.scope);
		}

	}).catch(function(error) {
		// registration failed
		console.log('Registration failed with ' + error);
	});
}
