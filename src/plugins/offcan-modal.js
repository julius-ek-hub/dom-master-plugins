import {states} from "../utils.js";
import $, { _boolean } from "../lib.js";

const offCanvasOrModalHandler = (offCanvasOrModalInstance, offCanvasOrModalElement, keyboard) => {
    
    const handleListener = e => {
        if (!offCanvasOrModalInstance._element)
            return $(window)._on('keyup', handleListener);
        ['escape', 'enter'].includes(e?.code?.toLowerCase()) && offCanvasOrModalInstance.hide();
    }

    keyboard && $(window).on('keyup', handleListener);

    const addZindex = () => {
        states.zIindex += 4;
        offCanvasOrModalElement.style({ zIndex: states.zIindex });
        $('body').lastChild().style({zIndex: states.zIindex - 2});
    }
    return {addZindex}
}

export default offCanvasOrModalHandler;