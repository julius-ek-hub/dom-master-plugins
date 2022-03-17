import collapseInstance from "./collapse-instance.js";

import { __,  bs } from "../utils.js";

import {_object} from '../lib.js';

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
 * @see https://www.247-dev.com/projects/dom-master/plugins/accordion
 */


const accordion = (content, props) => {
    const { toggle, title } = _object(props);

    let body = __('accordion-body').addChild(content || '');
    let abc = 'accordion-btn-collapsed';

    let collapse = __('accordion-collapse collapse').addChild(body);
    let toggler = __(['accordion-button', bs.btn], 'button').addChild(title || '');
    const item = __('accordion-item border-0 dom-master-plugin');

    collapse.on('show.bs.collapse', () => toggler.addClass(abc))
    .on('hide.bs.collapse', () => toggler.removeClass(abc))

    item.addChild([
        __('accordion-header', 'h2').addChild(toggler),
        collapse
    ]);

    return {...collapseInstance(collapse, toggle, item, toggler)};
}

export default accordion;