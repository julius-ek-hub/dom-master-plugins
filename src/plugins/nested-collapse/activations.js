import { sleep } from "../../utils.js";
import $, { isElement } from "../../lib.js";

export const activateClass = function(_a){
    const {active, activeClass} = this;
    if (active) {
        active.removeClass(activeClass);
    }
    _a.addClass(activeClass);
    this.active = _a;
}

export default async function(id){
    await sleep(100);
    let target = $(`div#${this.instanceID} .nested-collapse #${this.instanceID + id}`);
    if (!target.exists()) return; 
    let parent = target.parent();
    const _click = () => {
        let prev = parent.siblings().get(-1);
        if (parent.hasClass('nested-collapse') &&
            !parent.hasClass('show') && isElement(prev)) {
            prev.click();
            parent = prev.parent();
            _click();
        }
    }
    activateClass.call(this, target);
    _click();
}