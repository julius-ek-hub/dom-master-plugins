
import { states, sleep, bs, __, _number} from "../utils.js";
import {_bootstrap, _boolean, _string, _primitive, _object} from '../lib.js';
import { notificationIcon, warningIcon, close } from "../icons.js";

const { btn, oh, b_0, l_0, t_0, r_0, fixed, oa } = bs;

let runningToastsContainers = {};

let _position = {
    tl: [t_0, l_0],
    tc: [t_0, 'start-50 translate-middle-x'],
    tr: [t_0, r_0],
    ml: [l_0, 'top-50 translate-middle-y'],
    mc: ['top-50 start-50 translate-middle'],
    mr: [r_0, 'top-50 translate-middle-y'],
    bl: [l_0, b_0],
    bc: [b_0, 'start-50 translate-middle-x'],
    br: [r_0, b_0]
}

let updateTime = async() => {
    let rtcs = Object.values(runningToastsContainers);
   
    if (rtcs.length === 0) return;
    rtcs.forEach(rtc => {
        rtc.query('.toast-time').get().forEach(tt => {
            let then = Number(tt.attr('toast-time'));
            let now = Date.now();
            let diff = (now - then) / 1000;
            let update = 'now';
            if (diff > 60)
                update = Math.round(diff / 60) + 'm';
            if (diff > 60 * 60)
                update = Math.round(diff / (60 * 60)) + 'h';
            tt.refill(update);
        })
    });
    await sleep(2000);
    updateTime();
}


/**
 * ----------------------------------------------------------------
 * Dynamically generate and mount Bootstrap 5 Toasts anywhere on the viewport
 * ----------------------------------------------------------------
 * @param {String} message
 * @param {{
 * position: 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br', 
 * title: String, 
 * link: {url: String, name: String} | String, 
 * autodrop: Boolean, 
 * animation: Boolean, 
 * delay: Number,
 * type: 'error' | 'normal',
 * className: String
 * }} props
 * 
 * @property position, tl = Top left, tc = Top center, tr = Top right, ml = Middle left, mc = Middle center, mr = Middle right, bl = Bottom left, bc = Bottom center, br = Bottom right.
 * @property message The main message you are toasting to the user, must not be too long.
 * @property link, With this set, a button will be added to take take the user to the link provided if clicked. To give link a custom name, the supply an object with url and name properties
 * @property autodelete, Tells whether to delete the toast automatically after a period of time.
 * @property animation, tells whether to animate the appearance and disappearance of a toast or not.
 * @property delay, how long before a toast gets automatically deleted.
 * @property className Additional class name for your personal styles
 * 
 * @see https://www.247-dev.com/projects/dom-master/plugins/toast
 */

const toast = (message, props) => {
    let running = true;
    let { position, title: tt, link, autodrop: od, animation: an, delay: dl, type, className } = _object(props);
    position = (typeof position === 'string' && ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'].includes(position)) ? position : 'br';
    link = typeof link === 'string' ? { url: link, name: link } : (typeof link === 'object' && typeof link.url === 'string' ? link : undefined);
    let toastContainer = runningToastsContainers[position];
    if (!toastContainer) {
        toastContainer = __([fixed, 'toast-container p-3', ..._position[position]]).style({ zIndex: ++states.zIindex });
        toastContainer.appendTo(document.body);
        runningToastsContainers[position] = toastContainer;
    }
    const toast = __(`toast ${className || ''} dom-master-plugin`).attr({ role: "alert", "aria-live": "assertive", "aria-atomic": "true" });

    const toastHeader = __(`toast-header${type === 'error' ? ' toast-danger' : ''}`);
    const icon = type === 'error' ? warningIcon() : notificationIcon();
    const title = __('me-auto ms-1', 'strong').text(tt || (type === 'error' ? 'Error' : 'Notification'));
    const toastTime = __('text-muted toast-time').addChild('now').attr({ 'toast-time': Date.now() });
    const closeBtn = __('btn-close shadow-none', 'button').attr({ "data-bs-dismiss": "toast", "aria-label": "Close" });
    closeBtn.addChild(close().attr({width:'20', height: '20'}));

    const toastBody = __(['toast-body mini-scrollbar', oa]).style({ maxHeight: '300px' }).addChild(message);
    let actionBtn;
    if (link) {
        actionBtn = __([btn, 'btn-sm btn-primary text-nowrap'], 'a').attr({ href: link.url, target: link.target || '_blank' }).style({ maxWidth: '100%' }).addChild(link.name || link.url)
        toastBody.addChild(__([oh, 'mt-2 pt-2 border-top']).addChild(actionBtn));
    }

    toastHeader.addChild([icon, title, toastTime, closeBtn]);
    toast.addChild([toastHeader, toastBody]);
    toastContainer.addChild(toast);

    let bs = _bootstrap.Toast.getOrCreateInstance(toast.plain(0), {
        autohide: _boolean(od, true),
        animation: _boolean(an, true),
        delay: _number(dl, 5000)
    });

    const on = (event, callback) => {
        if(!running) return;
        const cbs = {
            drop: 'hide.bs.toast', 
            dropped: 'hidden.bs.toast',
            show: 'show.bs.toast',
            shown: 'shown.bs.toast'
        }
        toast.on(cbs[event], callback);
        return {
            
            /**
             * Hides the Toast
             */

            drop(){bs.hide()},

            /**
             * Shows the Toast
             */

            show(){
                bs.show();
                states.zIindex += 4;
                toastContainer.style({ zIndex: states.zIindex });
            },

            /**
             * Attach eventListeners to Toast
             * @param {'show' | 'shown' | 'drop' | 'dropped'} event 
             * @param {Function} callback 
             */

            on(event, callback){
                return on(event, callback);
            }
        }
    };

    toast.on('hidden.bs.toast', () => {
        toast.drop();
        if (toastContainer.children().get().plain().length === 0) {
            toastContainer.drop();
            delete runningToastsContainers[position];
        }
        running = false;
    });

    actionBtn && actionBtn.on('click', function(e) {
        bs.hide();
    });

    updateTime();

    return {

        /**
         * Attach eventListeners to Toast
         * @param {'show' | 'shown' | 'drop' | 'dropped'} event 
         * @param {Function} callback 
         */

        on(event, callback){
            return on(event, callback);
        },

        /**
         * Hides the Toast
         */

        drop(){
            if(!running) return;
            bs.hide();
        },

        /**
         * Shows the Toast
         */

        show(){
            if(!running) return;
            bs.show();
            states.zIindex += 4;
            toastContainer.style({ zIndex: states.zIindex });
        },

        /**
         * The Bootstrap 5 Toast instance
         */

        i: bs
    }
}

export default toast;