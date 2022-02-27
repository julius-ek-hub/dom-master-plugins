import {_boolean, Collapse} from "../lib.js";
import { sleep } from "../utils.js";

export default (collapse, toggle, item, toggler) => {
    let bsCollapse = new Collapse(collapse.plain(0), {
        toggle: _boolean(toggle, false)
    });
    toggler && toggler.on('click', function() {
        if (bsCollapse._element)
            bsCollapse.toggle();
    });

    /**
     * Attach eventListeners to the collapsible element
     * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
     * @param {Function} callback 
     */

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

        /**
         * The Bootstrap 5 collapse instance
         */

        i: bsCollapse,

        /**
         * Attach eventListeners to the collapsible element
         * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
         * @param {Function} callback 
         */

        on(event, callback){
            return on(event, callback);
        },

        /**
         * Hides the element
         */

        hide(){ 
            return bsCollapse.hide();
        },

        /**
         * Shows the element
         */

        show(){
            return bsCollapse.show();
        },

        /**
         * Toggles the element's visibility
         */

        toggle(){
            return bsCollapse.toggle();
        },

        /**
         * The element itself as a DOM master object
         */

        body: item,

        /**
         * Appends the element to anothe element
         * @param {HTMLElement | String} element Can be an HTMLElement or a selector string
         */

        appendTo(element){
            item.appendTo(element)
        },

        /**
         * Remove the element from the DOM
         */

        async drop(){
            await sleep(500);
            bsCollapse.hide();
            item.drop();
        }
    }
}