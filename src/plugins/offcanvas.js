import { __, sleep } from "../utils.js";

import {_bootstrap, _boolean, _object} from '../lib.js';
import offCanvasOrModalHandler from "./offcan-modal.js";
import { close } from "../icons.js";

/**
 * ----------------------------------------------------------------
 * Generates bootstrap 5 offCanvas plugin
 * ----------------------------------------------------------------
 * @param {*} content 
 * 
 * @param {{ 
 * header: Text | Element,
 * className: String,
 * position: 'top' | 'right' | 'bottom' | 'left',
 * backdrop: Boolean,
 * keyboard: Boolean,
 * scroll: Boolean,
 * parent: Element,
 * background: String,
 * border: String
 * }} props
 * 
 * @see https://www.247-dev.com/projects/dom-master/plugins/offCanvas
 */

 const offCanvas = (content, props) => {
    let { header, position, backdrop, keyboard, scroll, parent, background, border } = _object(props);
    const pos = { top: 'top', right: 'end', bottom: 'bottom', left: 'start' }
    const oCanvas = __(`offcanvas dom-master-plugin offcanvas-${pos[position] || 'start'}`);
    let _header; 
    let running = true;
    if (header) {
        _header = __('offcanvas-header');
        _header.addChild(header).style({ background });
        _header.addChild(__('btn-close', 'button')
            .addChild(close().attr({width:'25', height: '25'}))
            .attr({'data-bs-dismiss': "offcanvas" }));
    }
    parent = parent || document.body;
    const body = __('offcanvas-body').style({ background }).addChild(content);
    oCanvas.addChild([_header, body]).appendTo(parent);

    if (background) {
        body.style({ background: '' });
        _header?.style({ background: '' });
        oCanvas.style({ background });
    }
    if (border)
        oCanvas.style({ border });

    keyboard = _boolean(keyboard);

    let bs = new _bootstrap.Offcanvas(oCanvas.plain(0), {
        backdrop:  _boolean(backdrop),
        keyboard,
        scroll: _boolean(scroll, false)
    });

    const handler = offCanvasOrModalHandler(bs, oCanvas, keyboard);

    const on = (event, callback) => {
        const cbs = {
            hide: 'hide.bs.offcanvas',
            hidden: 'hidden.bs.offcanvas',
            show: 'show.bs.offcanvas',
            shown: 'shown.bs.offcanvas'
        }
        oCanvas.on(cbs[event], callback);

        return {
            
            /**
             * Hides the offcanvas
             */

            hide(){bs.hide()},
            
            /**
             * Shows the offcanvas
             */

            show(){
                bs.show();
                handler.addZindex();
            },

            /**
             * Attach eventListeners to offcanvas
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
        oCanvas.drop();
        running = false;
    }

    return {
        
        /**
        * Attach eventListeners to offcanvas
        * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
        * @param {Function} callback 
         */

         on(event, callback){
            return on(event, callback);
        },

        /**
         * Hides the offcanvas
         */  

        hide(){
            bs.hide();
        },

        /**
         * Shows the offcanvas
         */

        show(){
            bs.show();
            handler.addZindex();
        },

        /**
         * Toggles the offcanvas's visibility
         */

        toggle(){
            bs.toggle();
        },

        /**
         * Removes offcanvas from the DOM
         */

        drop(){
            drop();
        },
        
        /**
         * The Bootstrap 5 instance of the offcanvas
         */

         i: bs
    };
}

export default offCanvas;