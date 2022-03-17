import collapseHandler from "./collapse-handler.js";
import $, { Collapse, _boolean} from '../lib.js';
import { sleep } from "../utils.js";

/**
 * ----------------------------------------------------------------
 * Makes an element collapsible
 * ----------------------------------------------------------------
 * @param {HTMLElement} container Should be an HTMLElement or a domMaster object conataining 
 * at least an HTMLElement it's store.
 * @param {Boolean} toggle If true, will show the element initially. Default is false
 * @see https://www.247-dev.com/projects/dom-master/plugins/collapsible
 */

const collapsible = (container, toggle) => {
    const body = $(container).addClass('collapse');

    let bsCollapse = new Collapse(body.plain(0), {
        toggle: _boolean(toggle, false)
    });

    return {
        ...collapseHandler(bsCollapse, body),

        /**
         * The element itself as a DOM master object
         */

        body,

        /**
         * Appends the collapsible element to anothe element
         * @param {HTMLElement | String} element Can be an HTMLElement or a selector string
         */

         appendTo(element){
            body.appendTo(element)
        },

        /**
         * The Bootstrap 5 collapse instance
         */

         i: bsCollapse,

        /**
         * Remove the collapsible element from the DOM
         */
        
        async drop(){
            await sleep(500);
            bsCollapse.hide();
            body.drop();
        }
    };
}

export default collapsible;