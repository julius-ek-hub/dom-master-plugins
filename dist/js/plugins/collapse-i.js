import {_boolean, Collapse} from "../lib.js";
import { sleep } from "../utils.js";

export default (collapse, toggle, item, toggler) => {
    let bsCollapse = new Collapse(collapse.plain(0), {
        toggle: _boolean(toggle, false)
    });
    toggler && toggler.on('click', function() {
        if (bsCollapse._element)
            bsCollapse.toggle();
    })
    const on = (event, callback) => {
        const cbs = {
            hide: 'hide.bs.collapse',
            hidden: 'hidden.bs.collapse',
            show: 'show.bs.collapse',
            shown: 'shown.bs.collapse'
        }
        collapse.on(cbs[event], callback);
        return {
            on,
            hide: () => bsCollapse.hide(),
            show: () => bsCollapse.show(),
        };
    }

    return {
        i: bsCollapse,
        /**
         * Attach eventListeners to modal
         * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
         * @param {Function} callback 
         */
        on(event, callback){
            return on(event, callback);
        },
        hide(){
            return bsCollapse.hide();
        },
        show(){
            return bsCollapse.show();
        },
        toggle(){
            return bsCollapse.toggle();
        },
        body: item,
        appendTo(element){
            item.appendTo(element)
        },
        async drop(){
            await sleep(500);
            bsCollapse.hide();
            item.drop();
        }
    }
}