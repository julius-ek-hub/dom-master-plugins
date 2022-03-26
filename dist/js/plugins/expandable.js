import { bs } from "../utils.js";
import $ from '../lib.js';
import modal from "./modal.js";
let { jcc, aic, df, w, h } = bs;

/**
 * Clones an element and expand it in a modal for more visibility
 * @param {HTMLElement | String} element HTMLElement or selector string
 */

const expandable = (element) => {
    return $(element).style({ cursor: 'pointer' }).on('click', () => {
        let scale = 1;
        let clone = $(element).clone().removeClass('w-50').addClass('w-100')
        let box = $('</>').addClass([df, w, h, jcc, aic]);
        box.addChild(clone);
        let m = modal(box, {  background: 'transparent', innerScroll: false, header: '</>', borderLine: 'none'});
        m.on('hidden', m.drop);
        m.show();

        const zoom = e => {
            let dy = e.deltaY;
            if (((box.width() >= innerWidth || box.height() >= innerHeight) && dy < 0) ||
                (dy > 0 && scale <= 0.2)) return;
            if (dy < 0)
                scale += 0.1;
            else
                scale -= 0.1;
            box.style({ transform: `scale(${scale})` })
        }
        box.on('wheel', e => {
            zoom(e)
        }).on('swipe', e => {
            if (e.direction === 'top')
                zoom({ deltaY: -1, ...e })
            else if (e.direction === 'bottom')
                zoom({ deltaY: 1, ...e })
        })
    });
}

export default expandable;