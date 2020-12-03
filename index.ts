import $ from "jquery";
import Element from "@heymarco/element";


/**
 * a class for making "modal popup" functionallity.
 */
export default class Modal {
    /**
     * a function to be executed when the element with attribute data-modal="selector" is clicked
     */
    static clickHandler(event : MouseEvent) {
        // get the requested selector to be shown
        // from attribute data-modal="#the-requested-element-id" or data-modal=".the-requested-class"
        const selector = $(event.target as HTMLElement).data("modal") as string;

        // set active of the first matching element:
        this.setActive($(selector).first());
    }

    /**
     * a function to be executed when the overlay (a blurry background) modal is clicked
     */
    static overlayClickHandler(event : MouseEvent) {
        const $overlay = $(event.target as HTMLElement);

        // make sure the clicked element is the overlay itself, not the content inside overlay.
        // if the element has class .modal => it's the overlay element, otherwise the content
        if ($overlay.is(".modal")) this.setActive(null);
    }



    /**
     * a variable to remember the previously shown modal.
     */
    static _$activeModal : JQuery<HTMLElement> | null = null;

    /**
     * 
     * @param element an element to be shown (can be HTMLElement or selector string or jQuery object).
     * Set to null to hide the previous shown element.
     */
    static setActive(element : Selector | null) {
        const $element : JQuery<HTMLElement> =
            // @ts-ignore
            $(element);

        if ($element.length) {
            $element
            .removeClass("collapse")  // adding class .collapse causing the hiding animation stopped
            .addClass("expand") // adding class .expand causing the element shown and the show animation started
            ;

            this._$activeModal = $element; // remember the shown element, so we can hide it later

            Element.body.addClass(`${ this._class.replace(".", "") }-open`); // disable the browser's scrollbar when modal is open
        } else {
            // hide the previously shown element (if any):
            if (this._$activeModal) {
                this._$activeModal
                .removeClass("expand") // removing class .expand causing the element hide and the showing animation stopped
                .addClass("collapse") // adding class .collapse causing the hide animation started
                ;
            }

            this._$activeModal = null; // forget the shown element, nothing to hide in the future

            // re-enable the browser's scrollbar when modal is closed.
            // make sure the scrollbar enabled when the modal's hiding animation was completed.
            // the easiest way (lazy man) is assuming the animation no longer than 1000ms, so it's safe to re-enable it.
            setTimeout(() => {
                Element.body.removeClass(`${ this._class.replace(".", "") }-open`);
            }, 1000);
        }
    }

    /**
     * A shortcut to hide the previously shown modal.
     * Equivalent to setActive(null)
     */
    static setInactive() { this.setActive(null); }



    static _class = "";
    static get class() : string {
        return this._class;
    }

    static _modalClickHandler = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Modal.clickHandler(event as unknown as MouseEvent);
    static _modalOverlayClickHandler = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Modal.overlayClickHandler(event as unknown as MouseEvent);
    static set class(name : string) {
        if (this._class == name) return; // if its already the same, nothing to do.

        if (this._class != "") { // detach prev event (if has set)
            Element.document
            .off("click", `[data-${ this._class.replace(".", "") }]`, this._modalClickHandler)
            .off("click", this._class, this._modalOverlayClickHandler)
            ;
        }


        this._class = name;
        if (this._class != "") {
            Element.document

            // watch the click event of all element with attribute data-modal="something" in whole document.
            // when the element (ex: button) is clicked, the modal should be shown (if data-modal="something") or hidden (if data-modal="").
            .on("click", `[data-${ this._class.replace(".", "") }]`, this._modalClickHandler)

            // watch the click event of all element with class .modal in whole document.
            // when the modal's overlay clicked, the modal sholud be hidden.
            .on("click", this._class, this._modalOverlayClickHandler)
            ;
        } // if
    }
}

Modal.class = ".modal";
