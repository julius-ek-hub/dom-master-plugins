import {
    _boolean, 
    _object,
    isElement} from "../lib.js";

import { __, popUpInstances, bs} from "../utils.js";

import modal from "./modal.js";

/**
 * ---------------------------------------------
 * Creates a custom alert using Bootstrap 5
 * ----------------------------------------------
 * @param {String | Element} message an information to the user. Can be a string or Element.
 * @param {String | Element} button  Optional button to override default. Can be text or element.
 * @param {String} className  Additional class name for your personal styles
 * 
 * @see https://www.247-dev.com/projects/dom-master/plugins/Alert
 */

 const Alert  = (message, button, className) => {
    let footer = __(bs.btn, 'button').addChild('OK');
    if (typeof button === 'string')
        footer.refill(button);
    else if (isElement(button)) 
        footer = button;

    let mod = modal(message, {
        innerScroll: false,
        footer,
        className: `${className || ''} Alert`,
    });
    mod.on('hidden', () => {
        popUpInstances.shift().drop();
        if (popUpInstances.length > 0)
            popUpInstances[0].show();
    });
    footer.on('click', mod.hide);
    if (popUpInstances.length == 0) {
        mod.show();
    }
    popUpInstances.push(mod);
}

export default Alert;