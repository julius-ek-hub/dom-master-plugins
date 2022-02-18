
import Carousel from "./carousel.js";
import card from "./card.js";
import {_boolean, _object} from "../lib.js";
import { __, bs} from "../utils.js";

/**
 * ----------------------------------------------------------------
 * Generates a partition of elements such that only one element can 
 * be visible at a time. Check example in docs to understand
 * ----------------------------------------------------------------
 * @param {[{
 * title: Text | Element,
 * body: Element | Text | {
 * type: 'video' | 'picture' | 'other',
 * item: Element | Text | URL,
 * interval: Number,
 * controls: Boolean,
 * autoplay: Boolean,
 * }
 * }]} slides
 * 
 * @param {{
 * footer: Text | Element,
 * speed: Number,
 * alignHeader: 'left' | 'center' | 'right',
 * alignFooter: 'left' | 'center' | 'right',
 * breakHead: Boolean,
 * breakFoot: Boolean,
 * touch: Boolean
 * }} props
 * @see https://www.247-dev.com/projects/dom-master/plugins/section
 */

const partition = (slides, props) => {
    let {
    footer,
    alignHeader: ah,
    alignFooter: af,
    breakHead: bh,
    breakFoot: bf,
    speed,
    touch
    } = _object(props);

    let forCarousel = [];
    if (!Array.isArray(slides) || slides.length === 0) throw new Error('Invalid slides property');
    slides.forEach(slide => forCarousel.push(slide.body));

    ah = typeof ah === 'string' && ['left', 'right'].includes(ah) ? ah : 'center';
    af = typeof af === 'string' && ['left', 'right'].includes(af) ? af : 'center';
    bh = _boolean(bh, false) ? 'normal' : 'nowrap';
    bf = _boolean(bf, false) ? 'normal' : 'nowrap';

    const car = Carousel(forCarousel, {
        arrows: false,
        indicators: false,
        interval: false,
        autostart: false,
        touch,
        hover: true,
        keyboard: false,
        speed,
        cycle: false
    });
    let headers = [];
    
    slides.forEach((slide, index) => {
        let _btn = __([bs.btn, 'me-1'], 'button')
            .on('click', () => {
                car.to(index);
            })
            .addChild(slide.title);
        (index === 0) && _btn.addClass('btn-secondary');

        headers.push(_btn)
    });
    car.on('slide', e => {
        let frm = e.from,
            to = e.to;
        let res = 100 * e.to;
        headers[frm].removeClass('btn-secondary');
        headers[to].addClass('btn-secondary');
        headers[frm].parent().scrollTo({
            left: to > frm ? res : -res,
            behavior: 'smooth'
        });

        [slides[e.from].onHide, slides[e.to].onShow]
        .forEach(cb => typeof cb === 'function' && cb({ from: headers[frm], to: headers[to] }))
    })
    let cd = card(car.container, {
        header: headers,
        footer
    });
    let ch = cd.children();
    ch.get(0).style({ overflowX: 'auto', whiteSpace: bh, textAlign: ah });
    ch.get(1).style({ padding: '0', height: `0` })
    cd.style({ height: '100%', whiteSpace: bf, textAlign: af });
    return cd;
}

export default partition;