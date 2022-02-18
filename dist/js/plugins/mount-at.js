import Movable from "./movable.js";
import $, {isJQL, _array, isElement, _object} from "../lib.js";
import { states, _number } from "../utils.js";

/**
 * -------------------------------------------------------------------------
 * Mount an element at particular point (x, y) on the viewport extracted 
 * from the Event Object where where it occured. x and y can manually 
 * be passed as well.
 * --------------------------------------------------------------------------
 * @param {HTMLElement} element Should be an HTMLElement or a domMaster object conataining 
 * at least an HTMLElement it's store.
 * @param {{ 
 * x: Number,
 * y: Number, 
 * } | Event} eventObject You can pass an Event Object so the element can be 
 * placed exactly where the event occured and it would only respond to clicks
 * outside the element. But for a particular position, then pass an object with x and y 
 * properties as eventObject. This parameter is compulsory
 * 
 * @param {{ 
 * movable: HTMLElement,
 * onMove: Function, 
 * onMoving: Function, 
 * onMoved: Function
 * height: Number,
 * width: Number,
 * relativeTo: HTMLElement
 * }} props You can also make the element movable
 * after mounting by passing movable properperties as well else ignore.
 * 
 * @property movepoint. Can only be moved from this point if set
 * @property onMove. Called immidiately the element is moved
 * @property onMoving. Called when the element is moving
 * @property onMoved. Called when the element stops after moving.
 * @property height. The height of the element after mounting, default is 500
 * @property width. The width of the element after mounting, default is 300
 * @property relativeTo. Specify this element so that whenever the element is scrolled, the mounted 
 * element scrolls along with it else the mounted element stays fixed.
 * @see https://www.247-dev.com/projects/dom-master/plugins/mountAt
 */

const mountAt = (element, eventObject, props) => {
    let {height, width, movable,  relativeTo: rt, onMove, onMoving, onMoved } = _object(props);
    const el = $(element);
    const e = _object(eventObject);

    if(!(e instanceof Event)){
        e.x = _number(e.x);
        e.y = _number(e.y);
    }

    const path = _array(e.path);
    
    if(path.includes(el.plain(0))) return;
    el.addClass('mini-scrollbar');
    let x, y, _x, _y, to;

    height = height || 400;
    width = width || 250;
    el.style({
        height: height + 'px',
        width: width + 'px',
        zIndex: ++states.zIindex,
        left: 'unset',
        right: 'unset',
        bottom: 'unset',
        top: 'unset'
    });

    to = isJQL(rt) ? rt.plain(0) : isElement(rt) ? rt : null;
    to = to && path.includes(to) ? to : null;

    if (!to) {
        to = $(document.body);
        el.style({ position: 'fixed' });
        x = e.x;
        y = e.y;
        _y = innerHeight - y;
        _x = innerWidth - x;

        el.style({ top: y + 'px' });
        if (_y < height)
            el.style({ top: (y - (height - _y) - 20) + 'px' });

        el.style({ left: x + 'px' });
        if (_x < width)
            el.style({ left: x - (width - _x) - 20 + 'px' });
    } else {
        to = $(to);
        let bc = to.getBoundingClientRect();
        
        let offY = innerHeight - e.y - height;
        let offX = innerWidth - e.x - width;
        let distY = (e.y + to.scrollTop() - bc.top) + (offY < 0 ? (offY - 10) : 0);
        let distX = (e.x + to.scrollLeft() - bc.left) + (offX < 0 ? (offX - 20) : 0);

        to = to.style({ position: 'relative' });
        el.style({ position: 'absolute', top: distY + 'px' });
        el.style({ left: distX + 'px' });
    }
    el.appendTo(to);
    if (movable) {
        let movepoint = el;
        if (isJQL(movable))
            movepoint = movable;
        if (typeof movable === 'object' && movable.tagName)
            movepoint = $(movable);

        Movable(el.plain(0), {movepoint, onMove, onMoving, onMoved })
    }

    let transition = el.getStyle('transition');
    el.style({transform: 'scale(0)'});
    setTimeout(() => el.style({transition: '0.1s transform', transform: 'scale(1)'}), 1);
    setTimeout(() => el.style({transition}), 101);
    return el;
}

export default mountAt;