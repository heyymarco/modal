import Element from "@heymarco/element";
import ElementConfig from "@heymarco/element-config";



/**
 * A class for making "modal popup" functionallity.
 */
export default class Modal {
    /**
     * a variable to remember the previously shown modal.
     */
    static _activeModal : Element | null = null;

    /**
     * Set the active modal.
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

            Element.body.addClass(`${Modal.config.varPrefix}-open`); // disable the browser's scrollbar when modal is open
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
                Element.body.removeClass(`${Modal.config.varPrefix}-open`);
            }, 1000);
        }
    }

    /**
     * A shortcut to hide the previously shown modal.
     * Equivalents to setActive(null)
     */
    static setInactive() { this.setActive(null); }



    /**
     * A function to be executed when the modal's trigger (ex: button) with attribute data-modal="selector" was clicked.
     */
    static triggerClickHandler(event : MouseEvent) {
        // get the requested selector to be executed
        // from the attribute data-modal="#the-requested-element-id" or data-modal=".the-requested-class"
        const selector = (new Element(event.target as HTMLElement)).data(Modal.config.varPrefix) as string;

        // set active of the first matching element:
        this.setActive((new Element(selector)).first());
    }

    /**
     * A function to be executed when the modal or any contents inside the modal was clicked.
     */
    static clickHandler(event : MouseEvent) {
        const modal = new Element(event.target as HTMLElement);

        // make sure the clicked element is the overlay itself, not the content inside overlay.
        // if the element has class .modal => it's the overlay element, otherwise the content
        if (modal.is(Modal.config.class)) this.overlayClickHandler(event);
    }

    /**
     * A function to be executed when the overlay (a blurry background) of the modal was clicked.
     */
    static overlayClickHandler(event : MouseEvent) {
        this.setActive(null); // set active modal to nothing (close the previously actived one).
    }



    static _triggerClickHandler = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Modal.triggerClickHandler(event as unknown as MouseEvent);
    static _clickHandler        = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Modal.clickHandler(event as unknown as MouseEvent);
    static config = new ElementConfig(
        /* className    = */ ".modal",
        /* varPrefix    = */ "modal",
        /* deconfigure  = */ () => {
            Element.document

            // un-watch the click event of modal's trigger with attribute data-modal="something" in whole document.
            .off("click", `[data-${Modal.config.varPrefix}]`, Modal._triggerClickHandler)

            // un-watch the click event of modal's overlay in whole document.
            .off("click", Modal.config.class, Modal._clickHandler)
            ;
        },
        /* configure    = */ () => {
            Element.document

            // watch the click event of modal's trigger with attribute data-modal="something" in whole document.
            // when the modal's trigger (ex: button) is clicked, the modal should be shown (if the data-modal="something") or hidden (if data-modal="").
            .on("click", `[data-${Modal.config.varPrefix}]`, Modal._triggerClickHandler)

            // watch the click event of modal's overlay in whole document.
            // when the modal's overlay is clicked, the modal should be hidden.
            .on("click", Modal.config.class, Modal._clickHandler)
            ;
        },
        /* configFirst  = */ true // it's safe to apply the config immediately.
    );
}