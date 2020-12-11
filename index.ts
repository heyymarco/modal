import Element from "@heymarco/element";


/**
 * A class for making "modal popup" functionallity.
 */
export default class Modal {
    /**
     * A function to be executed when an element with attribute data-modal="selector" is clicked.
     */
    static clickHandler(event : MouseEvent) {
        // get the requested selector to be shown
        // from the attribute data-modal="#the-requested-element-id" or data-modal=".the-requested-class"
        const selector = (new Element(event.target as HTMLElement)).data(this.varPrefix) as string;

        // set active of the first matching element:
        this.setActive((new Element(selector)).first());
    }

    /**
     * A function to be executed when the overlay (a blurry background) of the modal is clicked.
     */
    static overlayClickHandler(event : MouseEvent) {
        const overlay = new Element(event.target as HTMLElement);

        // make sure the clicked element is the overlay itself, not the content inside overlay.
        // if the element has class .modal => it's the overlay element, otherwise the content
        if (overlay.is(this.class)) this.setActive(null); // set active element to nothing (close the previously actived one).
    }



    /**
     * a variable to remember the previously shown modal.
     */
    static _activeModal : Element | null = null;

    /**
     * 
     * @param selector an element to be shown (can be HTMLElement or selector string or jQuery object).
     * Set to null to hide the previous shown element.
     */
    static setActive(selector : Selector | null) {
        const element = selector ? new Element(selector) : null;

        if (element && element.length) {
            element
            .removeClass("collapse")  // removing class .collapse causing the hiding animation stopped
            .addClass("expand") // adding class .expand causing the element shown and the showing animation started
            ;

            this._activeModal = element; // remember the shown element, so we can hide it later

            Element.body.addClass(`${this.varPrefix}-open`); // disable the browser's scrollbar when modal is open
        } else {
            // hide the previously shown element (if any):
            if (this._activeModal) {
                this._activeModal
                .removeClass("expand") // removing class .expand causing the element hidden and the showing animation stopped
                .addClass("collapse") // adding class .collapse causing the hiding animation started
                ;
            }

            this._activeModal = null; // forget the shown element, nothing to hide in the future

            // re-enable the browser's scrollbar when modal is closed.
            // make sure the scrollbar enabled when the modal's hiding animation was completed.
            // the easiest way (lazy man) is assuming the animation no longer than 1000ms, so it's safe to re-enable it.
            setTimeout(() => {
                Element.body.removeClass(`${this.varPrefix}-open`);
            }, 1000);
        }
    }

    /**
     * A shortcut to hide the previously shown modal.
     * Equivalent to setActive(null)
     */
    static setInactive() { this.setActive(null); }



    static _class = "";
    static _varPrefix = "";
    /**
     * @returns default returning ".modal"
     */
    static get class() : string {
        return this._class;
    }

    static _clickHandler = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Modal.clickHandler(event as unknown as MouseEvent);
    static _overlayClickHandler = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Modal.overlayClickHandler(event as unknown as MouseEvent);
    /**
     * Customize the ".modal" class name.
     */
    static set class(name : string) {
        if (this._class == name) return; // if its already the same, nothing to do.

        if (this._class != "") { // detach prev event (if has set)
            Element.document
            .off("click", `[data-${this.varPrefix}]`, this._clickHandler)
            .off("click", this.class, this._overlayClickHandler)
            ;
        }


        this._class = name;
        this._varPrefix = (name || "").replace(".", "");
        if (this._class != "") {
            Element.document

            // watch the click event of all element with attribute data-modal="something" in whole document.
            // when the element (ex: button) is clicked, the modal should be shown (if data-modal="something") or hidden (if data-modal="").
            .on("click", `[data-${this.varPrefix}]`, this._clickHandler)

            // watch the click event of all element with class .modal in whole document.
            // when the modal's overlay clicked, the modal sholud be hidden.
            .on("click", this.class, this._overlayClickHandler)
            ;
        } // if
    }

    /**
     * @returns default returning "modal"
     */
    static get varPrefix() : string {
        return this._varPrefix;
    }
}

Modal.class = ".modal";
