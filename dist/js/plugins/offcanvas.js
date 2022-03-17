import {__} from "../utils.js";

import { _boolean, _object, Offcanvas} from '../lib.js';
import offCanvasOrModalHandler from "./offcan-modal.js";
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
    const _header = __('offcanvas-header');
    if (header) {
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

    return {
        ...offCanvasOrModalHandler(bsOffcanvas, oCanvas, 'offcanvas', keyboard),
        
        /**
         * The Bootstrap 5 instance of the plugin
         */

         i: bsOffcanvas
    };
}

export default offCanvas;