import $, {_string, _array, _primitive, _boolean} from "../../lib.js";
import { handleImmidateErrors, validator } from "./validate.js";
import Calendar from "../calendar/index.js";

import { no_emptyObject as neo, _number } from "../../utils.js";

const addFields = function (fields, after){
    const {fields: _fields, launched, form} = this;
    fields = _array(fields, [fields]);
    let updatedFields = [..._fields, ...fields];
    let { error } = validator(updatedFields);
    if (error) return console.error(error);
    if(launched === false) return console.error('Form instance does\'t exist');
    this.fields = updatedFields;

    fields.forEach(detail => {
        let type = detail.type || 'text';
        if (type === 'submit')
            type = 'text';
        if (type === 'radio')
            type = 'checkbox';
        let id = detail.id;
        let placeholder = _primitive(detail.placeholder);
        let default_value = _primitive(detail.default_value);
        let label = _primitive(detail.label);
        let description = _primitive(detail.description);
        let required = _boolean(detail.required, false);
        let options_ = _array(detail.options);
        let min = _number(detail.min);
        let max = _number(detail.max, 100);
        let height = _number(detail.height, 100);
        let vd = detail.validate;
        let _when = _string(vd && vd.when || '').toLowerCase();
        let when = (['live', 'submit'].includes(_when)) ? _when : 'submit';
        let attr = {type, id, name: id, title: label};
        let _label = label ? $('<label/>').addClass('form-label h6').attr({ for: id }).addChild(label) : $('<span />');
        let _input = $('<input class = "form-control shadow-none"/>')
            .required(required).attr(neo({
            placeholder,
            value: default_value,
             ...attr}));

        let _description = $('< class="text-secondary"/>').addChild(description);
        let _error = $('< class="text-danger"/>');

        let _container = $(`< class="mt-2" id="field_${id}" field-id = "${id}"/>`);
        if (type === 'checkbox') {
            _input = $('<input class="form-check-input shadow-none"/>').required(required).attr(neo(attr))
            _label.className('form-check-label');
            _container.addClass('form-check form-switch').addChild([_input, _label, _error, _description]);
        } else if (type === 'list') {
            let listId = 'dataList_' + id;
            let dList = $('<datalist/>').id(listId).addChild(options_.map(op => $('<option/>').addChild(op.value)));
            _input.removeAttribute('type').attr({ list: listId });
            _container.addChild([_label, _input, dList, _description, _error]);
        } else if (type === 'select') {
            _input = $(`<select class="form-select shadow-none"/>`)
                     .addChild(options_.map(op => $('<option/>').selected(_boolean(op.selected, false)).addChild(op.value)))
                     .attr(neo(attr))
            _container.addChild([_label, _input, _description, _error]);
        } else if (type === 'textarea') {
            _input = $('<textarea class = "form-control shadow-none"/>').attr(neo({
                placeholder,
                ...attr
            })).style({height});
            _input.text(default_value);
            _container.addChild([_label, _input, _description, _error]);
        } else {
            if (['number', 'range'].includes(type))
                _input.attr({ min, max });
            _container.addChild([_label, _input, _description, _error]);
        }
        if(after){
          let _after = form.find(`#field_${after}`);

          if(_after.plain() && _after.siblings().get(1).plain(0))
               form.insertBefore(_container, _after.siblings().get(1))
          else
              form.addChild(_container);
    
        }else{
            form.addChild(_container);
        }

        if(type === 'calendar')
            Calendar.listen(_input, null, ({value}) => {
                _input.value(value);
                when == 'live' && _input.addClass('valid');
            });

        if (when === 'live')
            handleImmidateErrors.call(this, _input)
    });
}

export default addFields;