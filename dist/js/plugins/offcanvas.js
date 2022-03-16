import { sleep, __, bs, states} from "../utils.js";

import $, { _boolean, _object, Offcanvas} from '../lib.js';
import { close } from "../icons.js";

/**
 * ----------------------------------------------------------------
 * Generates a bootstrap 5 offCanvas
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
    const _header = $('</>');
    if (header) {
        _header.addChild(header).addClass('offcanvas-header').style({ background });
        _header.addChild(__(['btn-close', bs.btn, 'text-reset'], 'button')
            .addChild(close().attr({width:'25', height: '25'}))
            .attr({'data-bs-dismiss': "offcanvas" }));
    }
    parent = parent || document.body;
    const body = __('offcanvas-body').style({ background }).addChild(content);
    oCanvas.addChild([_header, body]).appendTo(parent);
    if (background) {
        body.style({ background: '' });
        _header.style({ background: '' });
        oCanvas.style({ background });
    }
    if (border)
        oCanvas.style({ border });

    let bsOffcanvas = new Offcanvas(oCanvas.plain(0), {
        backdrop:  _boolean(backdrop),
        keyboard: _boolean(keyboard),
        scroll: _boolean(scroll, false)
    });

    const handleListener = e => {
        if (!bsOffcanvas._element)
            return $(window)._on('keyup', handleListener);
        ['escape', 'enter'].includes(e.code.toLowerCase()) && bsOffcanvas.hide();
    }

    _boolean(keyboard) && $(window).on('keyup', handleListener);

    const addZindex = () => {
        states.zIindex += 4;
        oCanvas.style({ zIndex: states.zIindex });
        $('body').lastChild().style({zIndex: states.zIindex - 2});
    }

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
             * Hides the modal
             */

            hide(){bsOffcanvas.hide()},

            
            /**
             * Shows the modal
             */

            show(){
                bsOffcanvas.show();
                addZindex();
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
        await sleep(500);
        bsOffcanvas.hide();
        oCanvas.drop();
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
            bsOffcanvas.hide();
        },

        /**
         * Shows the offcanvas
         */

        show(){
            bsOffcanvas.show();
            addZindex();
        },

        /**
         * Toggles the offcanvas's visibility
         */

        toggle(){
            bsOffcanvas.toggle();
        },

        /**
         * Removes offcanvas from the DOM
         */

        drop(){
            drop();
        },

        /**
         * The Bootstrap 5 offcanvas instance
         */

        i: bsOffcanvas
    }
}

export default offCanvas;