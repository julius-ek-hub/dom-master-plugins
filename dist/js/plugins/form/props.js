import { _object, isElement} from "../../lib.js";
import $ from "../../lib.js";
import { submit } from "./submit.js";

const props = function(info){

    info = _object(info);
    let form = $('<form/>');
    let attr = info.attributes;
    this.disabled = false;
    if(attr)
      form.attr(attr);
      this.cover = $(`
      <div class="hidden position-absolute top-0 bottom-0 start-0 end-0 cover" hidden>
          <div>
              <span class = "spinner-grow spinner-grow-lg"></span>
              <div class = "text-muted fw-bold">Please wait....</div>
          </div>
      </div>
      `);
    this.loading = $('<span class = "spinner-border spinner-border-sm  ms-1" hidden/>');
    this.fields = [];
    let sb = info.submitButton;
    let cb = info.cancelButton;
    this.container = $(`< class = "dom-master-plugin position-relative form ${info.className || ''}"/>`)
    .addChild([this.cover, $('< class="mb-1"/>').addChild(info.description || ''), form]);
    this.submitButton = (isElement(sb) ? $(sb): $(`<button class = "btn btn-primary submit-btn"/>`).text(typeof sb === 'string' ? sb : 'Submit')).click(submit.bind(this));
    this.cancelButton = (isElement(cb) ? $(cb): $(`<button class = "btn btn-light cancel-btn"/>`).text(typeof cb === 'string' ? cb : 'Cancel'));
    this.cancelButton.click(() => (this.modal && !this.validating && !this.disabled) && this.modal.hide());
    this.loading.appendTo(this.submitButton);
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