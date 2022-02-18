import $, {isElement, cord, _object} from "../lib.js";
import { states } from "../utils.js";

/**
 * ------------------------------------------------------------------
 * Will make an element to be moved on the screen to any position by 
 * dragging from anywhere or a particular spot
 * ------------------------------------------------------------------
 * @param {HTMLElement} movableElement Should be an HTMLElement or a domMaster object conataining 
 * at least an HTMLElement it's store.
 * @param {{ 
 * movepoint: HTMLElement,
 * onMove: Function, 
 * onMoving: Function, 
 * onMoved: Function
 * }} props
 * 
 * @property movepoint Can only be moved from this point if set
 * @property onMove Called immidiately the element is moved
 * @property onMoving Called when the element is moving
 * @property onMoved Called when the element stops after moving
 * @condition The element must have a position property set to 'absolute' or 'fixed'. 
 * You have to set this value by yourself.
 * @see https://www.247-dev.com/projects/dom-master/plugins/movable
 */

const movable = (movableElement, props) => {
    let {movepoint, onMove, onMoving, onMoved } = _object(props);
    let el = $(movableElement);

    let mousedown = false;
    const call = (fn, e) => typeof fn === 'function' && fn(e);
    let x, y, ol, ot, dx, dy;
    let _pos = side => {
        let st = el.getStyle(side);
        return Number(st.substring(0, st.length - 2))
    };
    el.style({ zIndex: ++states.zIindex }).on('mousedown touchstart', () => el.style({ zIndex: ++states.zIindex }));
    if (!movepoint)
        movepoint = el;
    if (isElement(movepoint)){
        movepoint = $(movepoint);
    }
    movepoint
        .style({ cursor: 'move' })
        .on('mousedown touchstart', e => {
            mousedown = true;
            let c = cord(e);
            x = c.x;
            y = c.y;
            ol = _pos('left');
            ot = _pos('top');
            call(onMove, e)
        })
        .on('mouseleave mouseup touchend', () => {
            mousedown = false;
            if ((dx && Math.abs(dx) > 0) || (dy && Math.abs(dy) > 0))
                call(onMoved);
            x = undefined;
            y = undefined;
            dx = undefined;
            dy = undefined;
        })
        .on('mousemove touchmove', e => {
            e.preventDefault()
            let c = cord(e);
            dx = c.x - x;
            dy = c.y - y;
            if (mousedown) {
                el.style({
                    top: (ot + dy) + 'px',
                    left: (ol + dx) + 'px',
                })
                call(onMoving, e)
            }
        })
    return el;
}

export default movable;