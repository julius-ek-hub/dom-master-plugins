import { sleep, __, states} from "../utils.js";
import $, { _boolean } from "../lib.js";

const offCanvasOrModalHandler = (offCanvasOrModalInstance, offCanvasOrModalElement, type, keyboard) => {
    let running = true;
    const handleListener = e => {
        if (!offCanvasOrModalInstance._element)
            return $(window)._on('keyup', handleListener);
        ['escape', 'enter'].includes(e?.code?.toLowerCase()) && offCanvasOrModalInstance.hide();
    }

    _boolean(keyboard) && $(window).on('keyup', handleListener);

    const addZindex = () => {
        states.zIindex += 4;
        offCanvasOrModalElement.style({ zIndex: states.zIindex });
        $('body').lastChild().style({zIndex: states.zIindex - 2});
    }

    const on = (event, callback) => {
        const cbs = {
            hide: `hide.bs.${type}`,
            hidden: `hidden.bs.${type}`,
            show: `show.bs.${type}`,
            shown: `shown.bs.${type}`,
            hidePrevented: `hidePrevented.bs.${type}`
        }
        offCanvasOrModalElement.on(cbs[event], callback);

        return {
            
            /**
             * Hides the modal
             */

            hide(){offCanvasOrModalInstance.hide()},

            
            /**
             * Shows the modal
             */

            show(){
                offCanvasOrModalInstance.show();
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
        if(!running) return;
        await sleep(500);
        offCanvasOrModalInstance.hide();
        offCanvasOrModalElement.drop();
        running = false;
    }

    return {

        /**
        * Attach eventListeners to plugin
        * @param {'show' | 'shown' | 'hide' | 'hidden'} event 
        * @param {Function} callback 
         */

        on(event, callback){
            return on(event, callback);
        },

        /**
         * Hides the plugin
         */  

        hide(){
            offCanvasOrModalInstance.hide();
        },

        /**
         * Shows the plugin
         */

        show(){
            offCanvasOrModalInstance.show();
            addZindex();
        },

        /**
         * Toggles the plugin's visibility
         */

        toggle(){
            offCanvasOrModalInstance.toggle();
        },

        /**
         * Removes plugin from the DOM
         */

        drop(){
            drop();
        }
    }
}

export default offCanvasOrModalHandler;