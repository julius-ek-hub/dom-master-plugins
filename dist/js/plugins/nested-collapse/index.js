import {linkIcon } from "../../icons.js";

import { random } from "../../utils.js";
import $, {isElement, _object } from "../../lib.js";
import validate from "./validate.js";
import addItem from "./add-item.js";
import activateCollapse from "./activations.js";

/**
 * Dynamically generate a nested collapsible element
 * @param {[{
 * href: URL,
 * id: String,
 * label: String,
 * children: items
 *  }]} items
 * 
 * @param {{
 * grid: 'vertical' | 'both' | 'none',
 * active: URL, 
 * linkIcon: SVGElement,
 * onclick: Function
 *  }} props 
 * @see https://www.247-dev.com/projects/dom-master/plugins/nestedcollapse
 */

const nestedCollapse = (items, props) => {

    let {grid, active, linkIcon: li, activeClass, onclick } = _object(props);

    let defaultProps = {
        instanceID: `collap_${random(700000, 5677788) + Date.now()}_se`,
        li: typeof li !== 'undefined' ? (isElement(li) ? $(li) : $(`<span>${li}</span>`)) : linkIcon(),
        activeClass: activeClass ? activeClass : 'text-primary',
        active: null,
        grid: typeof grid === 'string' && ['vertical', 'both', 'none'].includes(grid) ? grid : 'both',
        onclick
    }
    let container = $(`< id = "${defaultProps.instanceID}"/>`);

    validate(items);

    items.forEach(item => {
        container.addClass('jql-nested-collapse-container').addChild(addItem.call(defaultProps, item))
    });

    active && activateCollapse.call(defaultProps, active)

    return { 
        container, 
        active(id){
           id ? activateCollapse.call(defaultProps, id) : _active 
        }
    };
}

export default nestedCollapse;