/**
 * @class Matrix
 * This class will hold values of characters, find successful created words, delete them and etc
 *
 * @constructor
 * @param matrix {2DArray} Matrix of characters

 *
 * @property matrix {2DArray} Matrix of characters
 *
 *
 * @example
 *  //Create a new instance
 *  let matrix = new Matrix([[' ',' ',' ',' '],
 *                          [' ',' ',' ',' '],
 *                          [' ',' ',' ',' '],
 *                          [' ',' ',' ',' ']]
 *                          );
 */
class Matrix {
    constructor(matrix) {
        this.matrix = matrix;
    };


    /**
     * Create modal content
     * @param options
     * @return {HTMLDivElement}
     */
    createContent(options){
        let modalContent = document.createElement("div");
        modalContent.className = "contentModal";
        modalContent.innerHTML = options.content;

        return modalContent;
    }


    /**
     * Create modal footer and its buttons
     * @param options
     * @return {*}
     */
    createFooter(options){

        // Do we have footer for modals , create it and buttons
        if(options.buttons.length > 0){

            let footer = document.createElement("div");
            footer.className = "footerModal";


            // create buttons on footer
            options.buttons.forEach(function (optionBtn) {

                // create button
                let button = document.createElement("div");
                button.innerHTML = optionBtn.text || "";
                button.className = "buttonModal " + (optionBtn.isOk ? "isOk" : (optionBtn.notOk ? "notOk" : ""));
                button.onclick = optionBtn.onclick || (() => {});

                // add button to footer
                footer.appendChild(button);
            });

            return footer;
        }else{
            return false;
        }
    }


    /**
     * Show modal
     */
    show() {
        document.getElementById("container").classList.add('blur');
    }

    /**
     * Removes modal from page
     */
    destroy() {
        if(this.animate) {
            this.node.classList.add("bounceOut");
        }

        setTimeout(
            () => {
                document.getElementById("container").classList.remove('blur');
                this.node.parentNode.removeChild(this.node);
            }, (this.animate ? 310 : 0)
        );

        this.onDestroy();
    }

}

