import {_boolean} from "../lib.js";

const collapseHandler = (bsCollapse,  collapsibleElement) => {

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
        collapsibleElement.on(cbs[event], callback);
        return {
            on,
            hide: () => bsCollapse.hide(),
            show: () => bsCollapse.show(),
        };
    }

    return {

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

    }
}

export default collapseHandler;