import {_boolean} from "../../lib.js";
import addFields from "./addfields.js";
import Props from "./props.js";
import { appendTo, close, exists, inModal, loader, onOk, reset, submit } from "./submit.js";

/**
 * ----------------------------------------------------------------
 * Dynamically generate Bootstrap 5 Form from one to infinite number
 * of fields. Lunch the Form on a modal or append it to a particular 
 * element.
 * ----------------------------------------------------------------
 * 
 * @param {{
 * title: Text | Element,
 * description: Text | Element
 * attributes: {
 *     method: 'post' | 'get' | 'put' | 'delete',
 *     action: URL,
 *     enctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'
 * },
 * extraButtons: [Element | Text],
 * submitButton: Element | Text,
 * cancelButton: Element | Text
 * }} props
 * @see https://www.247-dev.com/projects/dom-master/plugins/form
 */

const form = (props) => {
let allProps = Props.call({}, props);

    return {
        /**
        * 
        * @param {[{ 
        * type: 'button' | 'checkbox' | 'textarea' | 'list' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week',
        * id: Number | String,
        * placeholder,
        * default_value,
        * description: String,
        * required: Boolean,
        * label: String,
        * options: [{id: Number | String, value: Number | String, selected: Boolean}],
        * min: Number,
        * max: Number,
        * height: Number,
        * validate: {
        * validator: Function,
        * when: 'submit' | 'live'
        * }
        * }]} _fields 
        * @param {String} after 
        */
        addFields(fields, after){
            return addFields.call(allProps, fields, after);
        },
        modal(){
            return inModal.call(allProps);
        },
        close(){
            return close.call(allProps);
        },
        ok(cb){
            return onOk.call(allProps, cb);
        },
        exists(id){
            return exists.call(allProps, id);
        },
        reset(){
            return reset.call(allProps);
        },
        appendTo(element){
            return appendTo.call(allProps, element)
        },
        submit(){
            return allProps.disabled ? undefined : submit.call(allProps);
        },
        loader(){
            return loader.call(allProps)
        },
        warn(id, message){
            allProps.form.find(`div#field_${id} .text-danger`).refill(message);
        },
        shake(){allProps.modal && allProps.modal.shake()},
        disable(value){
            allProps.disabled = _boolean(value);
        }
    }
}

export default  form;