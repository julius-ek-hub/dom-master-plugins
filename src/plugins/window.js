
import { __, bs, _number} from "../utils.js";
import $, {_bootstrap, _string, _object} from '../lib.js';
import { expandIcon, contractIcon, close as _close } from "../icons.js";
import mountAt from "./mount-at.js";

const { btn, df, aic, oh, oa } = bs;
let ini_x = 6,
    ini_y = 6;

 /**
  * ----------------------------------------------------------------
  * Dynamically generate a rectangular movable window on the viewport 
  * with minimize, maximize and close buttons.
  * ----------------------------------------------------------------
  * @param {*} content
  * @param {{
  * border: CSS,
  * height: Number,
  * width: Number,
  * title: String,
  * theme: 'windows' | 'mac',
  * x: Number,
  * y: Number,
  * movable: Boolean,
  * resizable: Boolean,
  * className: String,
  * fill: Boolean
  * } | Number} props All the properties of the window would be extracted from here.
  * 

  * @property title, The title of the window
  * @property height, The height of the window
  * @property width, the width of the window
  * @property x x-cordinate for mounting. Default is 6
  * @property y y-cordinate for mounting. Default is 6
  * @property border, Should be CSS border property value.
  * @property theme, How the window should appear like. Ms Windows' or Apple Mac's
  * @property className Additional class name for your personal styles
  * @property fill Makes the window to fill the screen and disable resize/movement
  * 
  * @see https://www.247-dev.com/projects/dom-master/plugins/window
  */

const _window = (content = '', props) => {
    let running = true;
    let callbacks = {minimized: null, maximized: null, closed: null};

    let left = 0,
        right = 0,
        top = 0,
        bottom = 0;

    let { border, height, width, fill, title, theme, movable = true, resizable = true, x: _x_, y: _y_, className } = _object(props);
    let x = _number(_x_, ini_x);
    let y = _number(_y_, ini_y);
    let e = { x, y, path: [] }
    border = _string(border, '1px solid rgba(0,0,0,.05)');
    height = _number(height, 500);
    width = _number(width, 300);
    title = _string(title);
    theme = _string(theme).toLowerCase() === 'windows' ? 'windows' : 'mac';

    let badge = (type = 'danger') => __(`badge rounded-pill bg-${type} p-2`, 'span').addChild(__('visually-hidden').addChild('close'));
    let el = __([oh, `rounded shadow ${className} dom-master-plugin window`]).style({ height, width, transition: '10ms height, 100ms width' }).style({ border });
    let titleBar = __(['w-100 text-nowrap ps-2', oh, df, aic]).addChild(title)
    let maxinizeBtn = __('ps-0', 'button').addChild(badge('success')).attr({ title: 'Maximize' });
    let minimizeBtn = __('ps-0', 'button').addChild(badge('warning')).attr({ title: 'Minimize' });
    let closeButton = __('<button/>').addChild(badge()).attr({ title: 'Close' });
    let buttonGroup = __('btn-group').attr({ role: 'group' }).addChild([closeButton, minimizeBtn, maxinizeBtn].map(b => b.addClass([df, aic, btn])));
    let header = __([df, 'header']).addChild([buttonGroup, titleBar]).style({ height: '40px', borderBottom: border });

    if (theme === 'windows') {
        header.refill([titleBar, buttonGroup]);
        buttonGroup.refill([minimizeBtn, maxinizeBtn, closeButton]).addClass('ms-auto');
        closeButton.addClass('ps-0').refill($(_close()).addClass('text-secondary'))
            .on('mouseenter', () => closeButton.children().get(0).addClass('text-danger'))
            .on('mouseleave', () => closeButton.children().get(0).removeClass('text-danger'))
        maxinizeBtn.refill($(expandIcon()).addClass('text-secondary'));
        minimizeBtn.removeClass('ps-0').refill($(contractIcon()).addClass('text-secondary'));
    }
    let body = __([oa, 'mini-scrollbar text-break body']).style({ height: 'calc(100% - 40px)' }).addChild(content);
    typeof content === 'string' && body.addClass('p-2')
    el.addChild([header, body]);

    const minimize = () => {
        if (!el.attr('expanded') || running === false || !resizable || fill) return;
        el.style({
            height: height + 'px',
            width: width + 'px',
            left,
            right,
            top,
            bottom
        }).removeAttribute('expanded');

        callbacks.minimized?.call();
        callbacks.resized?.call();
    };
    const maximize = () => {
        if (el.attr('expanded') || running === false || !resizable) return;
        left = el.getStyle('left');
        right = el.getStyle('right');
        top = el.getStyle('top');
        bottom = el.getStyle('bottom');
        el.style({
            height: '100%',
            width: '100%',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0'
        }).attr({ 'expanded': 'true' });
        callbacks.maximized?.call();
        callbacks.resized?.call();
    };

    const close = () => {
        el.drop();
        ini_x -= 20;
        ini_y -= 20;
        callbacks.closed?.call();
        running = false;
    };
    const moveTo = (x = 0, y = 0) => { 
        if(running === false || !movable) return;
        el.style({ left: x + 'px', top: y + 'px' });
    };
    const resizeTo = (_width = width, _height = height) => {
        if(running === false || !resizable) return;
        el.style({ width: _width + 'px', height: _height + 'px' });
        width = _width;
        height = _height;
        callbacks.resized?.call();
    };
    
    const on = (event, callback) => {
        if(typeof callback !== 'function' || typeof event !== 'string') return;
          event.trim().split(' ').map(e => {
              callbacks[e] = callback;
          });
    }

    minimizeBtn.on('click', minimize);
    maxinizeBtn.on('click', maximize)
    closeButton.on('click', close);
    header.on('dblclick', e => {
        if (e.path.some(p => [minimizeBtn.plain(0), maxinizeBtn.plain(0), closeButton.plain(0)].includes(p))) return;
        if (el.attr('expanded'))
            minimize();
        else
            maximize()
    });
    $(window).on('resize', ()=> {
        let _top = el.offsetTop();
        let _left = el.offsetLeft();
        if(_top < 0)
           el.style({top: 30});
        if(_left < 0)
           el.style({left: 30});
        if(_top + 30 > innerHeight)
           el.style({top: innerHeight - height - 30});
        if(_left + 30 > innerWidth)
        el.style({left: innerWidth - width - 30});
    });

    ini_x += 20;
    ini_y += 20;

    return { 

        /**
         * Maximizes the window
         */

        minimize(){
            minimize();
        }, 

        /**
         * Minimizes the window
         */

        maximize(){
            maximize()
        }, 

        /**
         * Opens the window
         */

        open(){
            mountAt(el, e, {height, width, movable: (movable && !fill) ? header: false });
            fill && maximize();
            callbacks.opened?.call();
            if(height >innerHeight)
                moveTo(e.x, 0);
        },

        /**
         * Closes the window
         */

        close(){
            close()
        }, 

        /**
         * Moves the window to new position
         * @param {Number} x 
         * @param {Number} y 
         */

        moveTo(x, y){
            moveTo(x, y);
        }, 

        /**
         * Resizes the window
         * @param {Number} newWidth 
         * @param {Number} newHeight 
         */

        resizeTo(newWidth, newHeight){
            resizeTo(newWidth, newHeight);
        }, 

        /**
         * Listen for events
         * @param {'resized' | 'closed' | 'minimized' | 'maximized' | 'opened'} event 
         * @param {Function} callback 
         */

        on(event, callback){
            on(event, callback)
        } 
    }
}

export default _window;