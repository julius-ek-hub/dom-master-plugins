import $, {
    _boolean, 
    _object, 
    _string, 
    isElement, 
    _bootstrap,
    _array} from "../lib.js";

import { __, sleep, states } from "../utils.js";



/**
 * Create dynamic Bootstrap 5 modal
 * @param {*} content 
 * @param {{
 *  header: *,
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
    });
    header.addChild([h2, h3]);

    let body = __('modal-body').addChild(content || '');
    let foot = __('modal-footer');

    if (bl) {
        foot.style({ borderTop: bl });
        header.style({ borderBottom: bl });
    }
    title && b2.addChild(header);

    b2.addChild(body);

    footer && b2.addChild(foot.addChild(footer));

    let modal = __("modal fade").addChild(b1.addChild(b2)).style({ zIndex: ++states.zIindex });
    modal.appendTo(parent);

    let bs = new _bootstrap.Modal(modal.plain(0), {
        backdrop,
        keyboard: _boolean(keyboard),
        focus: _boolean(focus, true)
    });

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
            hide(){bs.hide()},
            show(){bs.show()},
            /**
             * Attach eventListeners to modal
             * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
             * @param {Function} callback 
             */
            on(event, callback){return on(event, callback)}
        }
    };

    const handleListener = e => {
        if (!bs._element)
            $(window)._on('keyup', handleListener);
        ['escape', 'enter'].includes(e.code.toLowerCase()) && bs.hide();
    }

    _boolean(keyboard) && $(window).on('keyup', handleListener);
    const drop = async() => {
        if(!running) return;
        await sleep(500);
        bs.hide();
        modal.drop();
        running = false;
    };

    return {
        /**
         * Attach eventListeners to modal
         * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
         * @param {Function} callback 
         */
        on(event, callback){return on(event, callback)},
        hide(){bs.hide()},
        show(){bs.show()},
        toggle(){bs.toggle()},
        shake(){
            backdrop === 'static' && modal.click()
        },
        drop(){
            return drop();
        },
        i: bs
    }
}

export default modal;