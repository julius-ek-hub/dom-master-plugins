import { sleep } from "../utils.js";
import $, {_object} from "../lib.js";

/**
* ----------------------------------------------------------------
* Animates the children of an element if the element is scrolled
* ----------------------------------------------------------------
* @param {HTMLElement} scrollableElement Should be an HTMLElement or a domMaster object conataining 
* at least an HTMLElement it's store.
* @param {{ 
* transitionDuration: Number,
* transitionDistance: Number, 
* targets: String, 
* transitionType: 'to-top' | 'to-bottom' | 'to-left' | 'to-right'
* }} props
* @see https://www.247-dev.com/projects/dom-master/plugins/animateScroll
*/

const animateScroll = function(scrollableElement, props) {
    const el = $(scrollableElement);
    let { transitionDuration: td, transitionDistance: _td, targets, transitionType: tt } = _object(props);
    td = typeof td === 'number' ? td : 1000;
    _td = typeof _td === 'number' ? _td : 200;
    tt = (typeof tt === 'string' && ['to-top', 'to-bottom', 'to-left', 'to-right'].includes(tt)) ? tt : 'to-top';
    let x, y;

    switch (tt) {
        case 'to-top':
            x = 0;
            y = _td;
            break;
        case 'to-bottom':
            x = 0;
            y = -_td;
            break;
        case 'to-left':
            x = _td;
            y = 0;
            break;
        case 'to-right':
            x = -_td;
            y = 0;
    }
    let ch;
    if (targets && typeof targets === 'string')
        ch = el.query(targets).get();
    else
        ch = el.children().get();

    const init = () => ch.forEach(async(c) => {
        let transform = c.getStyle('transform');
        let opacity = c.getStyle('opacity');

        c.attr({ 'animate-scroll-initial-styles': JSON.stringify({ transform, opacity }) });
        c.attr({ 'animate-scroll-initial-transition': c.getStyle('transition') });
        c.style({ opacity: '0', transform: `translate(${x}px, ${y}px)` });
    });


    const runAnimation = () => {
        ch.forEach(async(c) => {
            if (c.isVisible(x, y)) {
                c.style(JSON.parse(c.attr('animate-scroll-initial-styles')))
                await sleep(td);
                c.style({ transition: c.attr('animate-scroll-initial-transition') })
            }
        });
    }

    init();
    ch.forEach(c => c.style({ transition: `${td}ms all` }));
    runAnimation();
    el.on('scroll', runAnimation);
}

export default animateScroll;