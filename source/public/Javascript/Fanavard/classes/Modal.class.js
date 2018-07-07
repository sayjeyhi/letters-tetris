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
 *  let modal = new Modal("This is a modal",false,()=>{alert('ok')},()=>{alert('no')});
 *
 *  //Show modal
 *  m.show();
 *
 *  //Destory instance
 *  m.destroy();
 *
 */
class Modal {

    constructor(text,isRtl,onOk,onNo) {
        this.text = text;
        this.isRtl= isRtl || false;
        this.onOk = onOk || (()=>{});
        this.onNo = onNo || (()=>{});


        let modalHolder = document.createElement('div');
        modalHolder.className="modalHolder";

        let modal = document.createElement('div');
        modal.className="modal " + (isRtl ? "rtl" : "ltr");
        modal.innerHTML = text;

        modalHolder.appendChild(modal);
        document.body.appendChild(modalHolder);
        this.node = modalHolder;


        // Detect all clicks on the document
        modalHolder.addEventListener("click", (event) =>{

            // If user clicks inside the element, do nothing
            if (event.target.closest(".modal")){
                this.onOk();
                return;
            }


            // If user clicks outside the element, hide it!
            this.onNo();
            this.destroy();

        });
    };


    /**
     * Show modal
     */
    show() {
        // this.node.style.display="block";
        document.getElementById("container").className+="blur";
    }

    /**
     * Removes modal from page
     */
    destroy() {
        this.node.parentNode.removeChild(this.node);
        document.getElementById("container").classList.remove('blur');
    }

}

