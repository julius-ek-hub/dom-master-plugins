import { _object, isElement} from "../../lib.js";
import $ from "../../lib.js";
import { submit } from "./submit.js";

const props = function(info){

    info = _object(info);
    let form = $('<form class = "dom-master-form"/>');
    let attr = info.attributes;
    if(attr)
      form.attr(attr);
    this.loading = $('< class = "d-flex align-items-center text-secondary"/>').addChild([
        $('<strong hidden>Validating...</strong>'),
        $('< hidden class = "spinner-border ms-auto"/>')
    ]);
    this.fields = [];
    let sb = info.submitButton;
    let cb = info.cancelButton;
    this.container = $('</>').addChild([this.loading, $('< class="mb-1"/>').addChild(info.description || ''), form]);
    this.submitButton = (isElement(sb) ? $(sb): $(`<button class = "btn btn-primary submit-btn"/>`).text(typeof sb === 'string' ? sb : 'Done')).click(submit.bind(this));
    this.cancelButton = (isElement(cb) ? $(cb): $(`<button class = "btn btn-light cancel-btn"/>`).text(typeof cb === 'string' ? cb : 'Cancel')).click(() => this.modal && this.modal.hide());
    this.form = form;
    this.info = info;

    this.getSpecificDetails = (field) =>{
        let type = field.attr('type');
        let value = field.value();
        if( type === 'checkbox')
            value = field.checked();
        if(type === 'file')
            value = field.files();
        if(type === 'calendar'){
            let check = value.split('/');
            if(check.length != 3 || check.some(c => isNaN(c)))
                value = '';
        }
        let info = this.fields.find(i => i.id === field.id());
        return { value, info };
       }

    return this;
}

export default props;