import collapseHandler from "./collapse-handler.js";

import { __,  bs, sleep } from "../utils.js";

import {_object, _bootstrap, _boolean} from '../lib.js';

/**
 * ----------------------------------------------------------------
 * Adds a Bootstrap 5 accordion to the target element
 * ----------------------------------------------------------------
 * @param {*} content Content of the accorfion
 * 
 * @param {{ 
 * title: Text,
 * toggle: Boolean
 * }} props
 * 
 * @see https://www.247-dev.com/projects/dom-master/plugins/accordion
 */


const accordion = (content, props) => {
    const { toggle, title } = _object(props);

    let body = __('accordion-body').addChild(content || '');
    let abc = 'accordion-btn-collapsed';

    let collapse = __('accordion-collapse collapse').addChild(body);
    let toggler = __(['accordion-button', bs.btn], 'button').addChild(title || '');
    const item = __('accordion-item dom-master-plugin');

    collapse.on('show.bs.collapse', () => toggler.addClass(abc))
    .on('hide.bs.collapse', () => toggler.removeClass(abc))

    item.addChild([
        __('accordion-header', 'h2').addChild(toggler),
        collapse
    ]);

    let bsCollapse = new _bootstrap.Collapse(collapse.plain(0), {
        toggle: _boolean(toggle, false)
    });

    toggler.on('click', function() {
        bsCollapse._element && bsCollapse.toggle();
    });

    return {
        ...collapseHandler(bsCollapse, collapse),

        /**
         * The accordion as a DOM master object
         */

        body: item,

        /**
         * Appends the accordion to anothe element
         * @param {HTMLElement | String} element Can be an HTMLElement or a selector string
         */

         appendTo(element){
            item.appendTo(element)
        },
 
        /**
         * The Bootstrap 5 collapse instance
         */
 
        i: bsCollapse,

        /**
         * Remove the accordion from the DOM
         */
        
        async drop(){
             await sleep(500);
             bsCollapse.hide();
             item.drop();
         }
    };
}

export default accordion;