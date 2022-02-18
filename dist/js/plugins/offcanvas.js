import { sleep, __, bs} from "../utils.js";

import $, { _boolean, _object, Offcanvas} from '../lib.js';

/**
 * ----------------------------------------------------------------
 * Generates a bootstrap 5 offCanvas
 * ----------------------------------------------------------------
 * @param {*} content 
 * 
 * @param {{ 
 * title: Text | Element,
 * position: 'top' | 'right' | 'bottom' | 'left',
 * backdrop: Boolean,
 * keyboard: Boolean,
 * scroll: Boolean,
 * parent: Element,
 * background: String,
 * border: String
 * }} props
 * 
 * @property movepoint Can only be dragged from this point if set
 * @property onMove Called immidiately the element is moved
 * @property onMoving Called when the element is moving
 * @property onMoved Called when the element stops after moving
 * @condition The element must have a position property set to 'absolute' or 'fixed'. 
 * You have to set this value by yourself since the method won't temper with your styling
 * @see https://www.247-dev.com/projects/dom-master/plugins/offCanvas
 */

const offCanvas = (content, props) => {
    let { title, position, backdrop, keyboard, scroll, parent, background, border } = _object(props);
    const pos = { top: 'top', right: 'end', bottom: 'bottom', left: 'start' }
    const oCanvas = __(`offcanvas jql-offcanvas offcanvas-${pos[position] || 'start'}`);
    const header = $('</>');
    if (title) {
        header.addChild(title).addClass('offcanvas-header').style({ background });
        header.addChild(__(['btn-close', bs.btn, 'text-reset'], 'button')
            .attr({'data-bs-dismiss': "offcanvas" }));
    }
    parent = parent || document.body;
    const body = __('offcanvas-body').style({ background }).addChild(content);
    oCanvas.addChild([header, body]).appendTo(parent);
    if (background) {
        body.style({ background: '' });
        header.style({ background: '' });
        oCanvas.style({ background });
    }
    if (border)
        oCanvas.style({ border });

    let bsOffcanvas = new Offcanvas(oCanvas.plain(0), {
        backdrop:  _boolean(backdrop),
        keyboard: _boolean(keyboard),
        scroll: _boolean(scroll, false)
    })

    const on = (event, callback) => {
        const cbs = {
            hide: 'hide.bs.offcanvas',
            hidden: 'hidden.bs.offcanvas',
            show: 'show.bs.offcanvas',
            shown: 'shown.bs.offcanvas'
        }
        oCanvas.on(cbs[event], callback);
        return {
            on,
            hide: () => bsOffcanvas.hide(),
            show: () => bsOffcanvas.show()
        };
    }

    const drop = async() => {
        await sleep(500);
        bsOffcanvas.hide();
        oCanvas.drop();
    }

    return {
        on,
        hide(){
            bsOffcanvas.hide();
        },
        show(){
            bsOffcanvas.show();
        },
        toggle(){
            bsOffcanvas.toggle();
        },
        drop(){
            drop();
        },
        i: bsOffcanvas
    }
}

export default offCanvas;