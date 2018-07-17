
const version = "0.6.11";
const CACHE_NAME = `persian-tetris-${version}`;


/*
Cache polyfill
 */
!function(){var t=Cache.prototype.addAll,e=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(e)var r=e[1],n=parseInt(e[2]);t&&(!e||"Firefox"===r&&46<=n||"Chrome"===r&&50<=n)||(Cache.prototype.addAll=function(r){var n=this;function o(t){this.name="NetworkError",this.code=19,this.message=t}return o.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return r=r.map(function(t){return t instanceof Request?t:String(t)}),Promise.all(r.map(function(t){"string"==typeof t&&(t=new Request(t));var e=new URL(t.url).protocol;if("http:"!==e&&"https:"!==e)throw new o("Invalid scheme");return fetch(t.clone())}))}).then(function(t){if(t.some(function(t){return!t.ok}))throw new o("Incorrect response status");return Promise.all(t.map(function(t,e){return n.put(r[e],t)}))}).then(function(){})},Cache.prototype.add=function(t){return this.addAll([t])})}();


const urlsToCache = [
	'/',
    '/?homescreen=1',
    '/App_bundle.js',
	'/assets/css/app/tetris.css',
	'/assets/localization/lang.en.json',
	'/assets/localization/lang.fa.json',
	'/assets/localization/lang.ja.json',
	'/assets/words/en/animals.json',
	'/assets/words/en/colors.json',
	'/assets/words/en/fruits.json',
	'/assets/words/en/things.json',
    '/assets/words/fa/animals.json',
    '/assets/words/fa/colors.json',
    '/assets/words/fa/fruits.json',
    '/assets/words/fa/things.json',
    '/assets/words/ja/animals.json',
    '/assets/words/ja/colors.json',
    '/assets/words/ja/fruits.json',
    '/assets/words/ja/things.json',
    '/assets/mp3/background.mp3',
    '/assets/mp3/explode.mp3',
    '/assets/mp3/finishGame.mp3',
    '/assets/mp3/foundWord.mp3',
    '/assets/mp3/loading.mp3',
    '/assets/mp3/moveChar.mp3',
    '/assets/mp3/pause.mp3',
    '/assets/mp3/start.mp3',
    '/assets/img/background.jpg',
    '/assets/img/mainBackground.jpg',
    '/assets/img/gameIcon-512x512.png',
];

self.addEventListener('install', event => {
    const timeStamp = Date.now();

	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => {
				return cache.addAll(urlsToCache);
			})
            .then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});



self.addEventListener('fetch', event => {
	event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});


// responseself.addEventListener('activate', event => {
// 	const cacheWhitelist = ['persian-tetris-v1', 'blog-posts-cache-v1'];
//
// 	event.waitUntil(
// 		caches.keys().then(cacheNames => {
// 			return Promise.all(
// 				cacheNames.map(cacheName => {
// 					if (cacheWhitelist.indexOf(cacheName) === -1) {
// 						return caches.delete(cacheName);
// 					}
// 				})
// 			);
// 		})
// 	);
// });
