/**
 * @module
 */


import Timeout from "./Timeout";

/**
 * @class Modal
 * Modal manager class which manages CRUD operation of Modals.
 *
 * @constructor
 * @param text {string} Text to show in modal
 * @param {boolean} [isRtl=false] Determines if text should be rtl or ltr
 * @param onOk {function} Executes if user clicked inside Modal
 * @param onNo {function} Executes if user clicked outside Modal
 *
 * @property isRtl {boolean} Show rtl status of modal
 *
 *
 * @example
 *  //Create a new instance
 *  let modal = new Modal({
 *       header : "Our Title goes here" ,
 *       content : "It is a message from our game to say yes you loose game !",
 *       buttons : [
 *           {
 *               text : "Ok",
 *               isOk : true,
 *               onclick : function () {
 *                   this.destroy();
 *               }
 *           },{
 *               text : "Do not",
 *               notOk : true,
 *               onclick : function () {
 *                   alert("say why?!");
 *               }
 *           }
 *       ]
 *   }, true );
 *
 *  //Show modal
 *  modal.show();
 *
 *  //Destory instance
 *  modal.destroy();
 *
 */
export default class Modal {

    /**
     * Constructor of modal class
     * @param options
     * @param isRtl
     */
    constructor(options, isRtl) {

        this.onDestroy = options.onDestroy || (() => {});
        this.isRtl = typeof isRtl === "undefined" ? false : isRtl;
        this.animate = typeof options.animate === "undefined" ? false : options.animate;
        this.dark = options.dark ? " dark " : "";
        this.type = options.type ? options.type : "";


        let modalHolder = document.createElement('div');
        let modal = document.createElement('div');
        let modalAnimateClass = this.animate ? "animated pulse" : "";


        modalHolder.className = "modalHolder";

        // add modal classes
        modal.className = modalAnimateClass + " modal " + this.type + " " + this.dark + (isRtl ? "rtl" : "ltr");


        // create title
        modal.appendChild(Modal._createHeader(options));

        // create content
        modal.appendChild(Modal._createContent(options));


        // create footer
        let footer = Modal._createFooter(options);
        if(footer !== false){
            modal.appendChild(footer);
        }


        modalHolder.appendChild(modal);
        document.body.appendChild(modalHolder);


        this.node = modalHolder;
        this.modal = modal;


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
     * @private
     */
    static _createHeader(options){
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
     * @private
     */
    static _createContent(options){
        let modalContent = document.createElement("div");
        modalContent.className = "contentModal";
        modalContent.innerHTML = options.content;

        return modalContent;
    }


    /**
     * Create modal footer and its buttons
     * @param options
     * @return {*}
     * @private
     */
    static _createFooter(options){

        // Do we have footer for modals , create it and buttons
        if(options.buttons && options.buttons.length > 0){

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
            this.modal.classList.remove("pulse");
            this.modal.classList.add("fadeOut");
        }

        Timeout.request(
            () => {
                document.getElementById("container").classList.remove('blur');
                this.node.parentNode.removeChild(this.node);
            }, (this.animate ? 310 : 0)
        );

        this.onDestroy();
    }

}

