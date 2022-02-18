import $, { _boolean, _string, _primitive, _object, isElement, isJQL } from "../lib.js";

import { popUpInstances, bs, __} from "../utils.js";

import modal from "./modal.js";

/**
 * ------------------------------------------------
 * Creates a custom confirm box using Bootstrap 5
 * ------------------------------------------------
 * @param {String} message
 * 
 * @param {{
 * title: String,
 * buttons: [{id: Number | String, value:  String | Element}],
 * }} props a confirmation message for the user or an object containing it.
 * 
 * @property message, a confirmation message for the user
 * @property title, The title of the confirm box
 * @property buttons, All the action buttons and their ids.. optional
 * 
 * @see https://www.247-dev.com/projects/jqlite/docs/confirm
 */

const Confirm = (message, props) => {
    let header = 'Confirm';
    let buttons = [
        { id: 0, value: 'No' },
        { id: 1, value: 'Yes' }
    ]

    const { buttons: bt, title: tt } = _object(props);
    header = tt;
    if (Array.isArray(bt) && bt.every(b => _primitive(b.id, null) && (isElement(b.value) || _string(b.value, null))))
        buttons = bt;

    buttons = buttons.map(b => {
        let { value, id } = b;
        let _b = __(bs.btn, 'button').addChild(value);
        if (typeof value === 'object')
            _b = isJQL(value) ? value : $(value);
        return _b.attr({ 'data-response': id });
    });

    let mod = modal(message, {
        header,
        innerScroll: false,
        footer: buttons,
        backdrop: 'static'
    });
    return new Promise((res, rej) => {
        mod.on('hidden', () => {
            popUpInstances.shift().drop();
            if (popUpInstances.length > 0)
                popUpInstances[0].show();
            rej();
        });
        buttons.forEach(bt => {
            bt.on('click', () => {
                let resp = bt.attr('data-response');
                if (resp === '0')
                    rej();
                else
                    res(resp)
                mod.hide();
            })
        })
        if (popUpInstances.length == 0)
            mod.show();
        popUpInstances.push(mod);
    })
}

export default Confirm;