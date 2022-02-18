import {_object} from "../../lib.js";
import { Try} from "../../utils.js";
import { loader } from "./submit.js";

export const validator = function(details) {
    let errMessage = null;
    let allIds = [];
    details.forEach((detail, index) => {
        let errorTrace = `Error Trace ${JSON.stringify(detail)}`;
        if (typeof detail !== 'object') {
            errMessage = `Invalid data found. ${errorTrace}`;
        } else if (typeof detail.id !== 'string' || !detail.id.match(/^[_a-z]/)) {
            errMessage = `'id' is required for every field and must start with a letter or underscore (_). ${errorTrace}`;
        } else {
            if(allIds.includes(detail.id))
                errMessage = `Unique 'id' is required for every field, Same 'id' detected, please double check the fields. ${errorTrace}`;
            allIds.push(detail.id)
            for (let i in detail) {
                if (i === 'validate' && detail[i]) {
                    let vd = detail[i];
                    if (vd && typeof vd !== 'object') {
                        errMessage = `Validate must be an object. ${errorTrace}`
                    } else {
                        let vtor = vd.validator;
                        if (!vtor)
                            errMessage = `If validate is provided, validator must also be provided. ${errorTrace}`;
                        else {
                            if (typeof vtor !== 'function')
                                errMessage = `Validator must be a function. ${errorTrace}`;
                        }
                    }
                } else if (i === 'required' && typeof detail[i] !== 'boolean')
                    errMessage = `required property must be of type boolean. ${errorTrace}`;
                else {
                    let type = detail.type;
                    let opts = detail.options;
                    let dv = detail.default_value;
                    if (i === 'default_value' && dv && type === 'number' && typeof dv !== 'number') {
                        errMessage = `If type is number, default_value must be of same type. ${errorTrace}`;
                    } else if (i === 'options') {
                        if (!Array.isArray(opts) ||
                            !opts.every(opt => Object.values(opt).every(e => !['function', 'object'].includes(typeof e))) ||
                            !opts.every(opt => ['id', 'value'].every(e => Object.keys(opt).includes(e))))
                            errMessage = `'options' should be an array of Objects having 'id' and 'value' properties, all of primitive types. ${errorTrace}`;
                    } else if (['min', 'max'].includes(i) && typeof detail[i] !== 'number')
                        errMessage = `'${i}' must be a number. ${errorTrace}`;
                    else {
                        if (['type', 'placeholder', 'description', 'label', 'id'].includes(i) &&
                            typeof detail[i] !== 'string')
                            errMessage = `Invalid value encountered. ${errorTrace}`;
                    }
                }

            };
        }
    })
    return { error: errMessage && `FormValidationError: ${errMessage}` || errMessage }
}

export const checkInput = function(info, value){
    let error = null;
    return new Promise(async(res) => {
        if ((info.required && String(value).trim() === '') || (info.type === 'checkbox' && value == false))
            error = 'This field is required';
        if (info.validate) {
            error = _object(await Try(() => info.validate.validator(value))).error;
        }
            res(error);
    })
}

export const handleImmidateErrors = function(field){
    field.on('keyup cut paste change', async() => {
        this.validating = true;
        let sd = this.getSpecificDetails(field);
        loader.call(this).show();
        let error = await checkInput(sd.info, sd.value);
        let _err = field.parent().find('.text-danger');
        if (error) {
            field.addClass('invalid').removeClass('valid');
            _err.refill(error);
        } else {
            field.removeClass('invalid').addClass('valid');
            _err.truncate();
        }
        loader.call(this).hide();
        this.validating = false;
    });
};

export const handleErrors = function(){
    const self = this;
    console.log(self)
    return new Promise(async(res) => {
        self.validating = true;
        let errors = null;
        let results = {};
        let checked = [];
        self.form.children().get().forEach(async(child, i, array) => {
            let field = child.find(`#${child.attr('field-id')}`);
            let sd = self.getSpecificDetails(field);
            let error = await checkInput(sd.info, sd.value);
            let _err = field.parent().query('.text-danger').get(0);
            if (error) {
                field.addClass('invalid');
                _err.refill(error);
                errors = true;
            } else {
                field.removeClass('invalid');
                _err.truncate();
                results[sd.info.id] = sd.value;
            }
            checked.push(i)
            if(checked.length === array.length)
               res({errors, results});
        })
    })
}