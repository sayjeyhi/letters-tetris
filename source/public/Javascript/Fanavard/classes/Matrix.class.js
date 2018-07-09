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

    /**
     * Constructor of modal class
     * @param options
     * @param isRtl
     */
    constructor(options, isRtl) {

        this.onDestroy = options.onDestroy || (() => {});
        this.isRtl = typeof isRtl === "undefined" ? false : isRtl;
        this.animate = typeof options.animate === "undefined" ? false : options.animate;


        let modalHolder = document.createElement('div');
        let modal = document.createElement('div');
        let modalAnimateClass = this.animate ? "animated bounceIn" : "";


        modalHolder.className="modalHolder";

        // add modal classes
        modal.className = modalAnimateClass + " modal " + (isRtl ? "rtl" : "ltr");


        // create title
        modal.appendChild(this.createHeader(options));

        // create content
        modal.appendChild(this.createContent(options));


        // create footer
        let footer = this.createFooter(options);
        if(footer !== false){
            modal.appendChild(footer);
        }


        modalHolder.appendChild(modal);
        document.body.appendChild(modalHolder);


        this.node = modalHolder;


        // Detect all clicks on the document
        modalHolder.addEventListener("click", (event) => {

            if(event.target.classList.contains("closeModal")){
                this.destroy();
            }
        })
    };


    /**
     * Create modal header
     * @param options
     * @return {HTMLDivElement}
     */
    createHeader(options){
        let modalTitle = document.createElement("div");
        let HeaderHtml = options.header || "";

        HeaderHtml += '<i class="linearicon linearicon-cross-circle closeModal"></i>';

        modalTitle.className = "titleModal";
        modalTitle.innerHTML = HeaderHtml;

        return modalTitle;
    }


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

