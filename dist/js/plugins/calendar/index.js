import { format } from "./utils.js";
import workers, {getProps} from "./workers.js";
import listen from "./listen.js";

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


    this.mountTo = async(container)=> {
        if(beforeMount){
            let bm = beforeMount();
            if(bm instanceof Promise)
                bm = await bm;
            beforeUnmount = bm;
        }
        workers.call(props, container);
    }

    this.unMount = props.unMount;

    this.useEffect = callback => beforeMount = typeof callback === 'function' ? callback : undefined;
    this.onChange = callback => onChange = typeof callback === 'function' ? callback : undefined;
    this.onOk = callback => onOk = typeof callback === 'function' ? callback : undefined;
}

Calendar.listen = function(selector, props, callback){
    listen.call(this, selector, props, callback);
}

export default Calendar;