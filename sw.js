const CACHE_NAME =
    "imageslide-player-v1";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",

    "./css/play.css",

    "./js/app.js",

    "./js/player.js",

    "./js/animations.js",

    "./js/storage.js",

    "./js/ui.js"

];


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(names => {

                    return Promise.all(

                        names
                            .filter(
                                name =>
                                    name !== CACHE_NAME
                            )
                            .map(
                                name =>
                                    caches.delete(name)
                            )

                    );

                })

        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(
                    event.request
                );

            })

        );

    }
);