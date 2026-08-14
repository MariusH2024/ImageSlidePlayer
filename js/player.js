let isTransitioning = false;

let currentIndex = 0;

let timer = null;

let progressTimer = null;

let playing = false;

let currentObjectUrl = null;

let nextObjectUrl = null;

let activeImage = 0;


const slideImageCurrent =
    document.getElementById(
        "slideImageCurrent"
    );


const slideImageNext =
    document.getElementById(
        "slideImageNext"
    );


const counter =
    document.getElementById(
        "counter"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const currentTime =
    document.getElementById(
        "currentTime"
    );


const totalTime =
    document.getElementById(
        "totalTime"
    );


const pauseBtn =
    document.getElementById(
        "pauseBtn"
    );


const imageElements = [

    slideImageCurrent,

    slideImageNext

];


/* ============================
   DEMARRAGE
============================ */

function startPlayer() {

    clearTimers();

    currentIndex = 0;

    playing = true;

    activeImage = 0;

    pauseBtn.textContent = "⏸";

    resetProgress();

    showFirstImage();

    preloadNextImage();

    startProgress();

    autoPlay();

}


/* ============================
   PREMIERE IMAGE
============================ */

function showFirstImage() {

    if (!images.length) {

        return;

    }


    if (currentObjectUrl) {

        URL.revokeObjectURL(
            currentObjectUrl
        );

    }


    currentObjectUrl =
        URL.createObjectURL(
            images[currentIndex]
        );


    slideImageCurrent.src =
        currentObjectUrl;


    slideImageCurrent.className =
        "slide-image active";


    slideImageNext.className =
        "slide-image";


    updateCounter();

}


/* ============================
   IMAGE SUIVANTE
============================ */

function nextSlide() {

    if (!images.length) {

        return;

    }


    const nextIndex =
        (currentIndex + 1)
        % images.length;


    transitionTo(
        nextIndex
    );

}


/* ============================
   IMAGE PRECEDENTE
============================ */

function previousSlide() {

    if (!images.length) {

        return;

    }


    const previousIndex =
        (currentIndex - 1 + images.length)
        % images.length;


    transitionTo(
        previousIndex
    );

}


/* ============================
   TRANSITION
============================ */

function transitionTo(newIndex) {

    // Empêche les transitions de se chevaucher
    if (isTransitioning) {
        return;
    }

    if (!images.length) {
        return;
    }

    if (newIndex === currentIndex) {
        return;
    }

    isTransitioning = true;

    const oldImage =
        imageElements[activeImage];

    const newImage =
        imageElements[1 - activeImage];


    // Nettoyage éventuel
    if (nextObjectUrl) {

        URL.revokeObjectURL(
            nextObjectUrl
        );

        nextObjectUrl = null;
    }


    // Créer l'URL de la nouvelle image
    nextObjectUrl =
        URL.createObjectURL(
            images[newIndex]
        );


    newImage.src =
        nextObjectUrl;


    // Réinitialiser complètement les classes
    newImage.className =
        "slide-image";


    oldImage.className =
        "slide-image active";


    /*
     * Choisir la transition
     */

    let type =
        transition.value;


    if (type === "random") {

        type =
            Animations.getRandom();

    }


    if (type === "slide") {

        const directions = [
            "slide-left",
            "slide-right",
            "slide-up",
            "slide-down"
        ];

        type =
            directions[
                Math.floor(
                    Math.random()
                    * directions.length
                )
            ];

    }


    const inClass =
        getInAnimation(type);

    const outClass =
        getOutAnimation(type);


    /*
     * Lancer les deux animations
     */


    const animationDuration =
    Math.min(
        Math.max(
            Number(duration.value) * 0.25,
            0.4
        ),
        1.2
    );

const transitionDuration =
    animationDuration + "s";


newImage.style
    .setProperty(
        "--transition-duration",
        transitionDuration
    );


oldImage.style
    .setProperty(
        "--transition-duration",
        transitionDuration
    );

    newImage.classList.add(
        "active",
        inClass
    );


    oldImage.classList.add(
        outClass
    );


    /*
     * Fin de transition
     */

    setTimeout(() => {

        oldImage.className =
            "slide-image";


        newImage.className =
            "slide-image active";


        activeImage =
            1 - activeImage;


        currentIndex =
            newIndex;


        /*
         * L'URL de la nouvelle
         * image devient l'URL courante
         */

        if (currentObjectUrl) {

            URL.revokeObjectURL(
                currentObjectUrl
            );

        }


        currentObjectUrl =
            nextObjectUrl;


        nextObjectUrl =
            null;


        updateCounter();

        resetProgress();

        isTransitioning = false;


        /*
         * Préparer la suivante
         */

        preloadNextImage();

    }, animationDuration * 1000);

}

/* ============================
   ANIMATION ENTRANTE
============================ */

function getInAnimation(type) {

    switch (type) {

        case "fade":
            return "fade-in";

        case "zoom":
        case "zoomIn":
        case "zoomOut":
            return "zoom-in";

        case "flip":
            return "flip-in";

        case "blur":
            return "blur-in";

        case "kenBurns":
            return "ken-burns";

        case "slide-left":
            return "slide-left-in";

        case "slide-right":
            return "slide-right-in";

        case "slide-up":
            return "slide-up-in";

        case "slide-down":
            return "slide-down-in";

        case "rotate":
            return "zoom-in";

        default:
            return "fade-in";

    }

}


/* ============================
   ANIMATION SORTANTE
============================ */

function getOutAnimation(type) {

    switch (type) {

        case "fade":
            return "fade-out";

        case "slide-left":
            return "slide-left-out";

        case "slide-right":
            return "slide-right-out";

        case "slide-up":
            return "slide-up-out";

        case "slide-down":
            return "slide-down-out";

        default:
            return "fade-out";

    }

}


/* ============================
   COMPTEUR
============================ */

function updateCounter() {

    counter.textContent =
        `${currentIndex + 1} / ${images.length}`;

}


/* ============================
   AUTOPLAY
============================ */

function autoPlay() {

    clearInterval(timer);

    timer = setInterval(() => {

        if (!playing) {
            return;
        }

        if (isTransitioning) {
            return;
        }

        nextSlide();

    }, Number(duration.value) * 1000);

}


/* ============================
   PROGRESSION
============================ */

function startProgress() {

    clearInterval(
        progressTimer
    );


    let elapsed = 0;


    progressTimer =
        setInterval(() => {

            if (!playing) {

                return;

            }


            elapsed += 100;


            const durationMs =
                Number(duration.value)
                * 1000;


            const percentage =
                Math.min(
                    elapsed /
                    durationMs *
                    100,
                    100
                );


            progressBar.style.width =
                percentage + "%";


            currentTime.textContent =
                formatTime(
                    elapsed / 1000
                );


            totalTime.textContent =
                formatTime(
                    Number(
                        duration.value
                    )
                );


        }, 100);

}


/* ============================
   RESET
============================ */

function resetProgress() {

    progressBar.style.width =
        "0%";

    currentTime.textContent =
        "0:00";

}


/* ============================
   PAUSE
============================ */

function pausePlayer() {

    playing = false;

    pauseBtn.textContent = "▶";

}


/* ============================
   REPRISE
============================ */

function resumePlayer() {

    playing = true;

    pauseBtn.textContent = "⏸";

}


/* ============================
   REJOUER
============================ */

function restartPlayer() {

    clearTimers();

    currentIndex = 0;

    playing = true;

    activeImage = 0;

    pauseBtn.textContent =
        "⏸";

    resetProgress();

    showFirstImage();

    preloadNextImage();

    startProgress();

    autoPlay();

}


/* ============================
   PRECHARGEMENT
============================ */

function preloadNextImage() {

    if (!images.length) {
        return;
    }


    const nextIndex =
        (currentIndex + 1)
        % images.length;


    const preloadImage =
        new Image();


    preloadImage.onload = () => {

        URL.revokeObjectURL(
            preloadImage.src
        );

    };


    preloadImage.src =
        URL.createObjectURL(
            images[nextIndex]
        );

}

/* ============================
   TEMPS
============================ */

function formatTime(
    seconds
) {

    seconds =
        Math.floor(seconds);


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return `${minutes}:${String(
        remaining
    ).padStart(2, "0")}`;

}


/* ============================
   NETTOYAGE
============================ */

function clearTimers() {

    clearInterval(timer);

    clearInterval(
        progressTimer
    );

}


/* ============================
   BOUTONS
============================ */

document
    .getElementById("nextBtn")
    .onclick = () => {

        if (isTransitioning) {
            return;
        }

        nextSlide();

    };

document
    .getElementById("previousBtn")
    .onclick = () => {

        if (isTransitioning) {
            return;
        }

        previousSlide();

    };
pauseBtn.onclick = () => {

    if (playing) {

        pausePlayer();

    }

    else {

        resumePlayer();

    }

};


document
    .getElementById("restartBtn")
    .onclick =
        restartPlayer;


document
    .getElementById("playerHomeBtn")
    .onclick = () => {

        clearTimers();

        playing = false;

        showScreen(
            "homeScreen"
        );

    };


document
    .getElementById("fullscreenBtn")
    .onclick = () => {

        if (
            document.fullscreenElement
        ) {

            document.exitFullscreen();

        }

        else {

            document.documentElement
                .requestFullscreen()
                .catch(() => {});

        }

    };