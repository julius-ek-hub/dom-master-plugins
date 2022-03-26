import {_boolean} from "../../lib.js";
import addFields from "./addfields.js";
import Props from "./props.js";
import { appendTo, close, exists, inModal, loader, onOk, reset, submit } from "./submit.js";

/**
 * ----------------------------------------------------------------
 * Dynamically generate Bootstrap 5 Form from one to infinite number
 * of fields. Lunch the Form on a modal or append it to a particular 
 * element in the DOM.
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
        * type: 'calendar' | 'button' | 'checkbox' | 'textarea' | 'list' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week',
        * id: Number | String,
        * placeholder,
        * default,
        * description: String,
        * required: Boolean,
        * label: String,
        * options: [{id: Number | String, value: Number | String, selected: Boolean}],
        * min: Number,
        * max: Number,
        * height: Number,
        * validate: {
        * validator: Function<String>,
        * when: 'submit' | 'live'
        * }
        * }]} fields 
        * @param {String} after 
        */

        addFields(fields, after){
            return addFields.call(allProps, fields, after);
        },

        /**
         * Launches the form in a modal
        */

        modal(){
            return inModal.call(allProps);
        },

        /**
         * If form was lunched in a modal, this method drops the modal
        */

        close(){
            return close.call(allProps);
        },

        /**
         * Sets a function to call when the results are ready.
         * @param {Function} callback 
        */

        ok(callback){
            return onOk.call(allProps, callback);
        },

        /**
         * Checks if a field with the given id exists
         * @param {String} id 
         * @returns {Boolean}
        */

        exists(id){
            return exists.call(allProps, id);
        },

        /**
         * Resets the form
        */

        reset(){
            return reset.call(allProps);
        },

        /**
         * Appends the form to another element, you can also use .modal()
         * @param {HTMLElement | String} element HTMLElement or a selector string
         * @returns 
         */

        appendTo(element){
            return appendTo.call(allProps, element)
        },

        /**
         * Submits the form
        */

        submit(){
            return allProps.disabled ? undefined : submit.call(allProps);
        },

        /**
         * The loading UI
         * @returns {{
         * hide: Function,
         * show: Function,
         * message: loader
         * }}
         */

        loader(){
            return loader.call(allProps)
        },

        /**
         * Display a warning message for a particular field.
         * @param {String} id The field id
         * @param {String} message The message
         */

        warn(id, message){
            allProps.form.find(`div#field_${id} .text-danger`).refill(message);
        },

        /**
         * If the form was lunched in a modal, this method when called will shake the modal
         * probably to indicate that something is not right
         */

        shake(){allProps.modal && allProps.modal.shake()},

        /**
         * Disables or enables the form
         * @param {Boolean} value 
         */

        disable(value){
            allProps.disabled = _boolean(value);
        }
    }
}

export default  form;