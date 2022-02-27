import { format } from "./utils.js";
import workers, {getProps} from "./workers.js";
import listen from "./listen.js";

/**
 * Generate a beautiful calendar for date picking. Fully customizable UI with 
 * 5 themes. Responsive and cross-browser compliance
 * @param {{
 * from: Number,
 * to: Number,
 * activeDate: String,
 * format: String,
 * theme: String
 * }} customProps The UI/UX of your calendar
 * @see https://www.247-dev.com/projects/dom-master/plugins/Calendar
 */
const Calendar = function(customProps){
    
    let beforeMount, beforeUnmount, onOk, onChange;

    const props = getProps(customProps);

    let fm = format.bind(props);
    
    props.unMount = async()=> {
        let bu;
        if(typeof beforeUnmount === 'function'){
            bu = beforeUnmount();
            if(bu instanceof Promise)
               bu = await bu;
        }
       props.ui.calendarContainer.drop();
       typeof bu === 'function' && bu();
    }

    props.onOk = () => onOk && onOk(fm());
    props.onChange = () => onChange && onChange(fm());

    /**
     * 
     * @param {HTMLElement | String} container The element to mount the calendar to. Can be a selector string
     */

    this.mountTo = async(container)=> {
        if(beforeMount){
            let bm = beforeMount();
            if(bm instanceof Promise)
                bm = await bm;
            beforeUnmount = bm;
        }
        workers.call(props, container);
    }

    /**
     * Removes calendar from the DOM
    */

    this.unMount = props.unMount;

    /**
     * @param {Function} callback The function to call before mounting the Calendar
    */

    this.useEffect = callback => beforeMount = typeof callback === 'function' ? callback : undefined;

    /**
     * @param {Function} callback The function to call when activeDate changes
    */

    this.onChange = callback => onChange = typeof callback === 'function' ? callback : undefined;

    /**
     * @param {Function} callback The function to call with the result when the user clicks ok button
    */

    this.ok = callback => onOk = typeof callback === 'function' ? callback : undefined;
}

/**
 * Generates a calendar where ever a click event occurs in the DOM according to targets
 * @param {NodeList | String} targets The elements to listen for click events, can be a NodeList or selector string
 * @param {{
 * from: Number,
 * to: Number,
 * activeDate: String,
 * format: String,
 * theme: String,
 * relativeTo: HTMLElement,
 * responsive: Boolean
 * }} props The UI/UX of your calendar
 * @param {Function} callback The function to call with the result 
 */

Calendar.listen = function(targets, props, callback){
    listen.call(this, targets, props, callback);
}

export default Calendar;