import { _object } from "../lib.js";
import $ from '../lib.js';

/**
 * Creates an input element of type file, appends it the body of the page, clicks on it 
 * so the user can choose a file depending on the attributes you pass. Then returns a 
 * Promise that resolves with an array of files only if the user actually chooses.
 * @param {{}} attributes Should be attributes for input Element in key/value pairs.
 * @returns {Promise}
 */

const pickFile = (attributes) => {
    return new Promise(res => {
        let inp = $('<input type="file" hidden/>');
        attributes = _object(attributes);
        delete attributes.type;
        inp.attr();
        inp.appendTo(document.body);
        inp.on('change', e=> {
            res([].slice.call(e.target.files))
        });
        inp.on('click', inp.drop)
        inp.click();
    })
}

export default pickFile;