const Animations = {

    getRandom() {

        const animations = [

            "fade",

            "zoom",

            "slide",

            "flip",

            "blur",

            "kenBurns"

        ];


        return animations[
            Math.floor(
                Math.random()
                * animations.length
            )
        ];

    }

};