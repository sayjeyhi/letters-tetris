

export default class WebAudio{
    constructor(){
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.context = new AudioContext();
        }
        catch(e) {
            Helper.log(`Unable to init WebAudio: ${e}`)
        }
    }





}
