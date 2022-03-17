import {
    _boolean, 
    _object, 
    _string, 
    isElement, 
    _bootstrap,
    _array} from "../lib.js";

import { __, sleep } from "../utils.js";
import offCanvasOrModalHandler from "./offcan-modal.js";
import { close } from "../icons.js";

/**
 * Create dynamic Bootstrap 5 modal
 * @param {*} content 
 * @param {{
 *  header: *,
 *  className: String,
 *  footer: *,
 *  background: String,
 *  backdrop: Boolean | 'static',
 *  focus: Boolean,
 *  keyboard: Boolean,
 *  parent: Element,
 *  borderLine: String,
 *  innerScroll: Boolean
 * }} props 
 * @see https://www.247-dev.com/projects/dom-master/plugins/modal
 */

 const modal = (content, props) => {
    let {
        header: title,
        className,
        footer,
        background,
        backdrop,
        focus,
        keyboard,
        parent,
        borderLine: bl,
        innerScroll: is
    } = _object(props);
    
    parent = isElement(parent)? parent : document.body;
    bl = _string(bl, false);
    is = _boolean(is, true);
    let running = true;

    backdrop = backdrop === 'static' ? 'static' : _boolean(backdrop);
    let scroll = is ? ' modal-dialog-scrollable' : '';
    let b1 = __(`modal-dialog modal-dialog-centered${scroll} p-0`);
    let b2 = __('modal-content');
    background && b2.style({ background, border: 'none' });
    let header = __('modal-header');
    let h2 = __('modal-title', 'h5').addChild(title || null)
    let h3 = __('btn-close', 'button').attr({
        type: 'button',
        'data-bs-dismiss': 'modal',
        'arial-label': 'Close'
    }).addChild(close().attr({width:'25', height: '25'}));
    header.addChild([h2, h3]);

    let body = __('modal-body text-break').addChild(content || '');
    let foot = __('modal-footer');

    if (bl) {
        foot.style({ borderTop: bl });
        header.style({ borderBottom: bl });
    }
    title && b2.addChild(header);

    b2.addChild(body);

    footer && b2.addChild(foot.addChild(footer));

    let modal = __(`modal fade ${className || ''} dom-master-plugin`).addChild(b1.addChild(b2));
    modal.appendTo(parent);

    keyboard = _boolean(keyboard);

    let bs = new _bootstrap.Modal(modal.plain(0), {
        backdrop,
        keyboard,
        focus: _boolean(focus, true)
    });

    const handler = offCanvasOrModalHandler(bs, modal, keyboard);

    const on = (event, callback) => {
        const cbs = {
            hide: 'hide.bs.modal',
            hidden: 'hidden.bs.modal',
            show: 'show.bs.modal',
            shown: 'shown.bs.modal',
            hidePrevented: 'hidePrevented.bs.modal'
        }
        modal.on(cbs[event], callback);

        return {
            
            /**
             * Hides the modal
             */

            hide(){bs.hide()},
            
            /**
             * Shows the modal
             */

            show(){
                bs.show();
                handler.addZindex();
            },

            /**
             * Attach eventListeners to modal
             * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
             * @param {Function} callback 
             */

            on(event, callback){return on(event, callback)}
        }
    }

    const drop = async() => {
        if(!running) return;
        await sleep(500);
        bs.hide();
        modal.drop();
        running = false;
    }

    return {
        /**
        * Attach eventListeners to modal
        * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
        * @param {Function} callback 
         */

         on(event, callback){
            return on(event, callback);
        },

        /**
         * Hides the modal
         */  

        hide(){
            bs.hide();
        },

        /**
         * Shows the modal
         */

        show(){
            bs.show();
            handler.addZindex();
        },

        /**
         * Toggles the modal's visibility
         */

        toggle(){
            bs.toggle();
        },

        /**
         * Removes modal from the DOM
         */

        drop(){
            drop();
        },

        /**
         * Shakes/vibrate the modal
         */

        shake(){
            backdrop === 'static' && modal.click()
        },

        /**
         * The Bootstrap 5 instance of the modal
         */

        i: bs
    }
}

export default modal;