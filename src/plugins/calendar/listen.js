import $, { _boolean, _object, isElement } from '../../lib.js';
import { sleep, _number } from '../../utils.js';
import mountAt from '../mount-at.js';
import modal from '../modal.js';

const responsiveMount = async(holder, calendar, okCallback) => {
    const md = modal(holder, {background: 'transparent'});
    md.show();
    md.on('hidden', md.drop).show();
    holder.parent().style({padding: '0'});

    holder.parent(1).style({
        width: '300px'
    });

    holder.parent(2).style({
        display: 'flex',
        justifyContent: 'center'
    });

    calendar.ok(okCallback);

    calendar.useEffect(()=> {
        return async() => {
            md.hide();
            await sleep(200)
        }
    })

    calendar.mountTo(holder.style({height: '500px', width: '300px'}));
}

const defaultMount = async(e, holder, calendar, props, okCallback) => {

    const outsideClick = e => !e.path.includes(holder.plain(0)) && calendar.unMount();

    calendar.useEffect(() => {
        return async() => {
            $(window)._on('click contextmenu', outsideClick);
            holder.style({transform: 'scale(0)'});
            await sleep(200);
            return holder.drop
        }
    })

    calendar.ok(okCallback);

    calendar.mountTo(holder);
    mountAt(holder, e, {
        height: _number(props.height, 500), 
        width: _number(props.width, 300),
        relativeTo: props.relativeTo
    });

    if(props.okOnChange)
        calendar.onChange(okCallback);

    await sleep(100);
    $(window).on('click contextmenu', outsideClick);
    await sleep(100);
    holder.style({transition: '0.2s transform'});
}

const handler = function(e, target, props, callback){

    const holder = $('</>');
    let activeDate = (target.tagName() === 'INPUT' && target.hasAttribute('touched')) ? target.value() : props.activeDate;
    props.activeDate = activeDate;
    props.responsive = _boolean(props.responsive, true);
    
    const calendar = new this(props);

    const okCallback = (value) => {
        calendar.unMount();
        typeof callback === 'function' && callback({value, target: target.plain(0)});
        target.attr({touched: 'true'});
    }

    if(props.responsive && innerWidth < 500)
        responsiveMount(holder, calendar, okCallback);
    else 
        defaultMount(e, holder, calendar, props, okCallback);

}



export default function (selector, props, callback){

    props = _object(props);
    callback = typeof callback === 'function' ? callback : ({value, target}) => {
        target.value = value;
    };

    let targets = $(selector || 'input[type="calendar"]').except('.has-calendar').get();

    if(targets.plain().length > 0 && targets.plain().every(isElement))
        targets.addClass('has-calendar').forEach(target => {
            target.on('keydown paste', e => e.preventDefault());
            
            target.value(props.format || 'MM/DD/YYYY').on('click contextmenu', e => {
                target.blur();
                e.preventDefault();
                handler.call(this, e, target, props, callback)
            }).blur();
        })
}