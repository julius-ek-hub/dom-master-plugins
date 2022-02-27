import collapseInstance from "./collapse-i.js";
import $ from '../lib.js'

/**
 * ----------------------------------------------------------------
 * Makes an element collapsible
 * ----------------------------------------------------------------
 * @param {HTMLElement} container Should be an HTMLElement or a domMaster object conataining 
 * at least an HTMLElement it's store.
 * @param {Boolean} toggle If true, will show the element initially. Default is false
 * @see https://www.247-dev.com/projects/dom-master/plugins/collapsible
 */

const collapsible = (container, toggle) => {
    const collapse = $(container).addClass('collapse');
    const instance = collapseInstance(collapse, toggle, collapse, false);
    return instance;
}

export default collapsible;