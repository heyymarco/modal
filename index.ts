import $ from "jquery";
import Element from "@heymarco/element";


/**
 * a class for making "modal popup" functionallity.
 */
export default class Modal {
    /**
     * a variable to remember the previous shown modal
     */
    static $activeModal : JQuery<HTMLElement> | null = null;

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

            this.$activeModal = $element; // remember the shown element, so we can hide it later

            Element.body.addClass("modal-open"); // disable the browser's scrollbar when modal is open
        } else {
            // hide the previously shown element (if any):
            if (this.$activeModal) {
                this.$activeModal
                .removeClass("expand") // removing class .expand causing the element hide and the showing animation stopped
                .addClass("collapse") // adding class .collapse causing the hide animation started
                ;
            }

            this.$activeModal = null; // forget the shown element, nothing to hide in the future

            // re-enable the browser's scrollbar when modal is closed.
            // make sure the scrollbar enabled when the modal's hiding animation was completed.
            // the easiest way (lazy man) is assuming the animation no longer than 1000ms, so it's safe to re-enable it.
            setTimeout(() => {
                Element.body.removeClass("modal-open");
            }, 1000);
        }
    }

    /**
     * A shortcut to hide the previously shown modal.
     * Equivalent to setActive(null)
     */
    static setInactive() { this.setActive(null); }
}


// watch the click event of all element with attribute data-modal="something" in whole document.
// when the element (ex: button) is clicked, the modal should be shown (if data-modal="something") or hidden (if data-modal="").
Element.document.on("click", "[data-modal]", (event) => Modal.clickHandler(event as unknown as MouseEvent));

// watch the click event of all element with class .modal in whole document.
// when the modal's overlay clicked, the modal sholud be hidden.
Element.document.on("click", ".modal", (event) => Modal.overlayClickHandler(event as unknown as MouseEvent));
