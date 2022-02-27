import {_object} from "../lib.js";
import { __ } from "../utils.js";

/**
 * 
 * @param {*} body 
 * @param {{
 * header: *,
 * footer: *
 * }} props 
 * @see https://www.247-dev.com/projects/dom-master/plugins/card
 */

const card = (body, props) => {
    const { header, footer } = _object(props);
    const card = __('card dom-master-plugin');
    if (header)
        card.addChild(__('card-header').addChild(header))
    card.addChild(__('card-body').style({ whiteSpace: 'normal' }).addChild(body || ''))
    if (footer)
        card.addChild(__('card-footer').addChild(footer))
    return card;
}

export default card;