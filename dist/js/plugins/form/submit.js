import { __ } from "../../utils.js";
import $, {_array} from "../../lib.js";
import { handleErrors } from "./validate.js";
import modal from "../modal.js";

export const loader = function(){
    let action = hide => this.loading.children().get().forEach(c => c.hide(hide));
    return {
        show: () => action(false),
        hide: () => action(),
        message: message =>{
             this.loading.firstChild().truncate().text(message)
             return loader.call(this);
        }
    }
}
export function exists(id) { return this.form.query(`#${id}`).get().plain().length > 0};

export function reset(){
    const {form} = this;
    form.reset().query('.text-danger').get().truncate();
    form.query('.valid, invalid').get().removeClass('valid invalid');
}
export function close(){
    if(this.modal && this.launched)
       this.modal.hide();
}

export function onOk(cb){
 if(typeof cb === 'function')
   this.ok = cb;
 else
   throw new Error('\'callback\' must be a function')
}

export async function submit(){
    const {validating, disabled, modal, form, ok, submitButton} = this;;
    if(validating || disabled) return;
    loader.call(this).show()
    submitButton.blur();
    let { errors, results } = await handleErrors.call(this);
    this.validating = false;
    loader.call(this).hide();
    if (errors) {
        modal && modal.shake();
        return;
    }
    modal && modal.hide();
    if(form.hasAttribute('action'))
       form.submit();
    else 
       ok && ok(results);
    reset.call(this);
}

export function inModal(){
    const {_static, launched, fields, info, form, cancelButton, submitButton, container} = this;
    if(_static) return console.error('Can not perform both static and modal launch for the same Form instance');
    if(launched) return console.warn('Form instance can not be launched more than once');

    if(fields.length === 0) return console.error('formLaunchError: At least 1 field is needed to launch the form');
    let {title:tt, extraButtons:xb} = info;
    form.firstChild().removeClass('mt-2');
    let buttons = _array(xb, [xb ? xb : '']);
    buttons.push(cancelButton);
    buttons.push(submitButton);

    let md = modal(container, {
            backdrop: 'static',
            header: tt,
            footer: buttons,
            keyboard: false,
        });
    this.modal = md;

        md.on('hidden', () => {
            md.drop();
            this.launched = false;
        });
        md.show();

        cancelButton.on('click', md.hide);

    $(window).on('keyup', e => {
        let tg = $(e.target);
        if ((md ? md.i._element : true) && e.code && e.code.toLowerCase() === 'enter' &&
            !(tg.tagName() === 'TEXTAREA' || tg.hasAttribute('contenteditable')))
            submitButton.click();
    })
    this.launched = true;
}

export function appendTo(element){
    const {fields, modal, launched, info, container, submitButton} = this;
    if(fields.length === 0) return console.error('formLaunchError: At least 1 field is needed to launch the form');
    if(modal) return console.error('Can not perform both static and modal launch for the same Form instance');
    if(launched) return console.warn('Form instance can not be launched more than once');

    let {title, extraButtons:xb} = info;
    let buttons = _array(xb, [xb ? xb: '']);
    buttons.push(submitButton);
    container.insertBefore(__('h4').addChild(title), container.firstChild())
    container.addChild(__('text-end mt-2').addChild(buttons));
    this._static = true;
    container.appendTo(element);
    this.launched = true;
}
