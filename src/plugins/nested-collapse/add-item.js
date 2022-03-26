import { Chevron } from "../../icons.js";
import { sleep, bs } from "../../utils.js";
import $ from "../../lib.js";

import { activateClass } from "./activations.js";

const { df, aic } = bs;

const col_btn = (label, collapse_id) => {
    let btn = $('<button type="button"/>').style({
        whiteSpace: 'normal'
    }).addClass(['dropdown-item has-dropdown', df, aic]).addChild(label);
    collapse_id && btn.attr({
        'data-bs-toggle': 'collapse',
        'data-bs-target': `#${collapse_id}`,
    })
    return btn;
 }

const left_line = () => $('</>').style({
    width: '16px',
    height: '2px',
    background: 'rgba(0,0,0,0.2)',
    marginLeft: '-16px',
    marginBottom: 'auto',
    marginTop: '12px',
    flexShrink: '0'
});

const addItem = function(item, line) {
    const {li, grid, onclick, instanceID} = this;
    const children = item.children;
    let open = false;
    const id = instanceID + item.id
    if (children) {
        const col = $('< class = "collapse nested-collapse"/>')
            .id(id)
            .addChild(children.map(child => addItem.call(this, child, true)))
            .style({ marginLeft: '23px' });
        if (grid != 'none')
            col.style({ borderLeft: '2px solid rgba(0,0,0,0.2)' })
        const toggle = (btn, show) => {
            let style = {
                transform: 'rotate(0deg)',
                marginRight: ''
            }
            if (col.hasClass('show') || (show && open))
                style = {
                    transform: 'rotate(90deg)',
                    marginRight: '2px'
                }
            btn.children().get(line && grid === 'both' ? 1 : 0).style(style);
        }
        const btn = col_btn([line && grid === 'both' ? left_line() : '', Chevron(), item.label], id).click(async() => {
            open = !open;
            toggle(btn, true);
            await sleep(360)
            toggle(btn);
        });
        return [btn, col];
    } else {
        let cont = [];
        if (line && grid === 'both')
            cont.push(left_line())
        cont.push(li.clone().style({
            marginRight: '2px',
            flexShrink: '0',
            marginBottom: 'auto',
            marginTop: '6px'
        }));
        cont.push(item.label);
        let _a = $('<a/>').style({
            whiteSpace: 'normal'
        });
        return _a.attr({
            href: item.href,
            id
        }).on('click', () => {
            if (onclick && typeof onclick === 'function')
                onclick({ id: item.id, target: _a })
            activateClass.call(this, _a);
        }).addClass(['dropdown-item no-dropdown', df, aic]).addChild(cont);
    }
}

export default addItem; 