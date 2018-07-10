/**
 * @class Settings to show and set game settings
 */

'use strict';

class Settings extends TetrisGame {

    /**
     * Set settings from localStorage OR settings Object
     * @param settings
     */
    static set(settings) {


        if(typeof settings !== "undefined"){

            // save setting data
            Storage.set("settings" , settings);

        }else{
            settings = Storage.getJson('settings' , false);
            if(!settings){
                return false;
            }
        }

        let config = TetrisGame.config;

        config.useAnimationFlag = parseInt(settings.useAnimation) === 1;
        config.playEventsSound = parseInt(settings.eventSounds) === 1;
        config.playBackgroundSound = parseInt(settings.soundPlay) === 1;
        config.showGrids = parseInt(settings.showGrids) === 1;
        config.level = parseInt(settings.gameLevel) || 1;



        // pause/play background music
        if(!config.playBackgroundSound){
            TetrisGame.initValues.bgSound.pause();
        }else{
            TetrisGame.initValues.bgSound.play();
        }


        // manage grids on play board
        if(TetrisGame.playBoard) {
            if (config.showGrids) {
                TetrisGame.playBoard.classList.add("showGrids");
            } else {
                TetrisGame.playBoard.classList.remove("showGrids");
            }
        }

        // add level class to body AND do staffs about leveling
        let bodyClass = "";
        switch(settings.gameLevel){
            case 3:
                bodyClass = "isExpert";

                // use two word  same time at hard mode
                config.workingWordCount = 2;

                break;
            case 2:
                bodyClass = "isMedium";
                break;
            default:
                bodyClass = "isSimple";
        }
        document.body.classList.remove("isExpert" , "isMedium" , "isSimple");
        document.body.classList.add(bodyClass);
    }


    /**
     * Show game settings
     */
    static show() {

        // get defined settings
        let settings = Storage.getJson('settings' , {
            soundPlay : 1,
            eventSounds : 1,
            useAnimation : 1,
            gameLevel : 1,
            showGrids : 0
        });

        // pause game timer
        TetrisGame.timer.pause();

        // should we animate span ?
        let spanAnimationClass = (TetrisGame.config.useAnimationFlag ? " animatedSpan" : "");


        // create setting modal content
        let content =
            '<form id="settingForm" class="cssRadio ' + spanAnimationClass + '">' +
            '<div class="formRow">' +
            '<div class="formLabel"><i class="linearicon linearicon-music-note2"></i> ' + lang.backgroundMusic + '</div>' +
            '<div class="formData">' +
            '<input id="soundPlayYes" type="radio" name="soundPlay" value="1" ' + (settings.soundPlay === 1 ? "checked" : "") + ' />' +
            '<label for="soundPlayYes"><span>' + lang.active + '</span></label>' +
            '<input id="soundPlayNo" type="radio" name="soundPlay" value="0" ' + (settings.soundPlay === 0 ? "checked" : "") + ' />' +
            '<label for="soundPlayNo"><span>' + lang.deActive + '</span></label>' +
            '</div>' +
            '</div>' +

            '<div class="formRow">' +
            '<div class="formLabel"><i class="linearicon linearicon-music-note"></i> ' + lang.eventsMusic + '</div>' +
            '<div class="formData">' +
            '<input id="eventSoundsYes" type="radio" name="eventSounds" value="1" ' + (settings.eventSounds === 1 ? "checked" : "") + ' />' +
            '<label for="eventSoundsYes"><span>' + lang.active + '</span></label>' +
            '<input id="eventSoundsNo" type="radio" name="eventSounds" value="0" ' + (settings.eventSounds === 0 ? "checked" : "") + ' />' +
            '<label for="eventSoundsNo"><span>' + lang.deActive + '</span></label>' +
            '</div>' +
            '</div>' +


            '<div class="formRow">' +
            '<div class="formLabel"><i class="linearicon linearicon-magic-wand"></i> ' + lang.animation + '</div>' +
            '<div class="formData">' +
            '<input id="useAnimationYes" type="radio" name="useAnimation" value="1" ' + (settings.useAnimation === 1 ? "checked" : "") + ' />' +
            '<label for="useAnimationYes"><span>' + lang.active + '</span></label>' +
            '<input id="useAnimationNo" type="radio" name="useAnimation" value="0" ' + (settings.useAnimation === 0 ? "checked" : "") + ' />' +
            '<label for="useAnimationNo"><span>' + lang.deActive + '</span></label>' +
            '</div>' +
            '</div>' +

            '<div class="formRow">' +
            '<div class="formLabel"><i class="linearicon linearicon-grid"></i> ' + lang.showGrids + '</div>' +
            '<div class="formData">' +
            '<input id="showGridsYes" type="radio" name="showGrids" value="1" ' + (settings.showGrids === 1 ? "checked" : "") + ' />' +
            '<label for="showGridsYes"><span>' + lang.active + '</span></label>' +
            '<input id="showGridsNo" type="radio" name="showGrids" value="0" ' + (settings.showGrids === 0 ? "checked" : "") + ' />' +
            '<label for="showGridsNo"><span>' + lang.deActive + '</span></label>' +
            '</div>' +
            '</div>' +


            '<div class="formRow">' +
            '<div class="formLabel"><i class="linearicon linearicon-game"></i> ' + lang.gameLevel + '</div>' +
            '<div class="formData">' +
            '<input id="gameLevelEasy" type="radio" name="gameLevel" value="1" ' + (settings.gameLevel === 1 ? "checked" : "") + ' />' +
            '<label for="gameLevelEasy"><span>'+ lang.simple + '</span></label>' +
            '<input id="gameLevelMedium" type="radio" name="gameLevel" value="2" ' + (settings.gameLevel === 2 ? "checked" : "") + ' />' +
            '<label for="gameLevelMedium"><span>'+ lang.medium + '</span></label>' +
            '<input id="gameLevelExpert" type="radio" name="gameLevel" value="3" ' + (settings.gameLevel === 3 ? "checked" : "") + ' />' +
            '<label for="gameLevelExpert"><span>' + lang.expert + '</span></label>' +
            '</div>' +
            '</div>' +

            '</form>';

        // show setting modal
        let settingModal = new Modal({
            animate : TetrisGame.config.useAnimationFlag,
            header : lang.settingModalTitle,
            content : content,
            onDestroy : function () {
                // resume timer
                TetrisGame.timer.resume();
            },
            buttons : [
                {
                    text : lang.save,
                    isOk : true,
                    onclick : function () {

                        // start timer
                        TetrisGame.timer.resume();

                        // catch data
                        let settingForm = document.querySelector("#settingForm");
                        let settingData = {};
                        settingData.soundPlay = parseInt(settingForm.querySelector('[name="soundPlay"]:checked').value);
                        settingData.eventSounds = parseInt(settingForm.querySelector('[name="eventSounds"]:checked').value);
                        settingData.useAnimation = parseInt(settingForm.querySelector('[name="useAnimation"]:checked').value);
                        settingData.gameLevel = parseInt(settingForm.querySelector('[name="gameLevel"]:checked').value);
                        settingData.showGrids = parseInt(settingForm.querySelector('[name="showGrids"]:checked').value);

                        // apply setting and save it
                        Settings.set(settingData);

                        // remove modal
                        settingModal.destroy();
                    }
                },
                {
                    text : lang.close,
                    onclick : function () {
                        settingModal.destroy();
                    }
                }
            ]
        }, lang.rtl );

        settingModal.show();
    }
}
