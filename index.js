"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const element_1=__importDefault(require("@heymarco/element"));class Modal{static clickHandler(event){const selector=new element_1.default(event.target).data(this.varPrefix);this.setActive(new element_1.default(selector).first())}static overlayClickHandler(event){new element_1.default(event.target).is(this.class)&&this.setActive(null)}static setActive(selector){const element=selector?new element_1.default(selector):null;element&&element.length?(element.removeClass("collapse").addClass("expand"),this._activeModal=element,element_1.default.body.addClass(`${this.varPrefix}-open`)):(this._activeModal&&this._activeModal.removeClass("expand").addClass("collapse"),this._activeModal=null,setTimeout(()=>{element_1.default.body.removeClass(`${this.varPrefix}-open`)},1e3))}static setInactive(){this.setActive(null)}static get class(){return this._class}static set class(name){this._class!=name&&(""!=this._class&&element_1.default.document.off("click",`[data-${this.varPrefix}]`,this._modalClickHandler).off("click",this.class,this._modalOverlayClickHandler),this._class=name,this._varPrefix=(name||"").replace(".",""),""!=this._class&&element_1.default.document.on("click",`[data-${this.varPrefix}]`,this._modalClickHandler).on("click",this.class,this._modalOverlayClickHandler))}static get varPrefix(){return this._varPrefix}}exports.default=Modal,Modal._activeModal=null,Modal._class="",Modal._varPrefix="",Modal._modalClickHandler=(event=>Modal.clickHandler(event)),Modal._modalOverlayClickHandler=(event=>Modal.overlayClickHandler(event)),Modal.class=".modal";
