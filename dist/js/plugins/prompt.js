import $, { _boolean, _string, _object } from "../lib.js";

import { popUpInstances, __, bs} from "../utils.js";

import Calendar from "./calendar/index.js";
import modal from "./modal.js";

/**
 * Creates a custom propmt using Bootstrap 5
 * @param {String} message
 * 
 * @param {{
 * type: 'color' | 'date' | 'calendar' | 'datetime-local' | 'email' | 'file' | 'month' | 'number' | 'password' | 'range' | 'tel' | 'text' | 'time' | 'url' | 'week',
 * default: String,
 * okButton: String,
 * cancelButton: String
 * }} props an information to the user about the input.
 * 
 * @returns {Promise<String | String[]>}
 * @property type, The type of input. Should be an HTMlInput type
 * @property okButton, text or Element to display in the Ok button.
 * @property cancelButton, text or Element to display in the cancel button.
 * 
 * @see https://www.247-dev.com/projects/dom-master/plugins/Prompt
 */

const Prompt = (message, props) => {
    let {type, okButton: ob, cancelButton: cb, default: ini } = _object(props);
    type = ['color', 'date', 'calendar', 'datetime-local', 'email', 'file', 'month', 'number', 'password', 'range', 'tel', 'text', 'time', 'url', 'week'].includes(type) ? type : 'text';
    let inp = __('form-control shadow-none border-none', 'input').attr({ type });
    inp.style({
        marginBottom: '-17px',
        border: 'none',
        borderRadius: '0',
        borderBottom: '1px solid #ced4da'
    }).value(ini && ini || '');

    let body = [$('<h5/>').text(_string(message)), inp];
    let done = __(bs.btn, 'button').addChild('Done');
    let cancel = __(bs.btn, 'button').addChild('Cancel');
    if (typeof ob === 'string')
        done.refill(ob);
    else if (typeof ob === 'object')
        done = ob;
    if (typeof cb === 'string')
        cancel.refill(cb);
    else if (typeof cb === 'object')
        cancel = cb;

    let mod = modal(body, {
        innerScroll: false,
        footer: [cancel, done]
    });

    return new Promise((res, rej) => {
        mod.on('hidden', () => {
            popUpInstances.shift().drop();
            if (popUpInstances.length > 0)
                popUpInstances[0].show();
            rej();
        });
        mod.on('shown', () => {
            inp.focus();
            inp.select();
        });
        cancel.on('click', mod.hide);
        done.on('click', () => {
            res(type === 'file'? inp.files() : inp.value());
            mod.hide();
        })
        if (popUpInstances.length == 0){
            mod.show();
            if(type === 'calendar')
                Calendar.listen(inp, null, ({target, value}) => target.value = value);
        }
        popUpInstances.push(mod);
    })
}

export default Prompt;