class AudioHandler{
    constructor() {
        this.song1 = document.getElementById("song1");
        this.song2 = document.getElementById("song2");
        this.ambience = document.getElementById("ambience");
        this.click = document.getElementById("click");
        this.ow = document.getElementById("ow");
        this.snowStep = document.getElementById("snowstep");
        this.dirtStep = document.getElementById("dirtstep");
        this.bee = document.getElementById("bee");
        this.backpack = document.getElementById("backpack");

        this.currentSong = -1;

        this.song1.volume = 0.1;
        this.song2.volume = 0.1;

        this.ambience.volume = 0.2;
        this.click.volume = 0.3;
        this.ow.volume = 0.2;
        this.snowStep.volume = 0.2;
        this.dirtStep.volume = 0.2;
        this.bee.volume = 0.2;
        this.backpack.volume = 0.3;

        this.musicList = [
            this.song1,
            this.song2
        ]

        this.bee.loop = true;
        this.ambience.loop = true;
    }

    toggleMute() {
        document.querySelectorAll("audio").forEach( (elem) => 
        {
            elem.muted = !elem.muted; 
        });
    }

    update() {
        if (this.musicList[this.currentSong].ended) {
            this.playAndLoopMusic();
        }
    }

    playAndLoopMusic(){
        this.currentSong++;
        if (this.currentSong >= this.musicList.length)
            this.currentSong = 0;

        this.musicList[this.currentSong].currentTime = 0;
        this.musicList[this.currentSong].play();
        this.musicPlaying = true;
    }

    playAmbience(ambience) {
        if (ambience === "bee") {
            this.bee.play();
            this.ambience.pause();
            this.ambience.currentTime = 0;
        } else {
            this.ambience.play();
            this.bee.pause();
            this.bee.currentTime = 0;
        }
    }

    playTileStep(tileName) {
        if (tileName === "Snow") {
            this.playSnowStep();
        } else {
            this.playDirtStep();
        }
    }

    playOw() {
        this.snowStep.currentTime = 0;
        this.ow.play();
    }

    playSnowStep() {
        this.snowStep.currentTime = 0;
        this.snowStep.play();
    }

    playDirtStep() {
        //this.dirtStep.currentTime = 0;
        this.dirtStep.play();
    }

    playClick() {
        this.snowStep.currentTime = 0;
        this.click.play();
    }

    playBackpack() {
        this.snowStep.currentTime = 0;
        this.backpack.play();
    }
};

export const GLOBAL_AUDIO_HANDLER = new AudioHandler();