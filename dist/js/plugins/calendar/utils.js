import { sleep } from "../../utils.js";

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const month_names = [
    'January', 'February',
    'March', 'April', 'May',
    'June', 'July', 'August',
    'September', 'October',
    'November', 'December'
];

export const isLeap = year => (year % 4 === 0 && year % 100 != 0) || year % 400 === 0;

export const months = year => [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


export const slide = async(from , to, direction, callback) => {

    let initialToStyle = {left: '100%', right: '-100%'};
    let finalFromStyle = {left: '-100%', right: '100%'};

    if(direction === 'right'){
        initialToStyle = {left: '-100%', right: '100%'};
        finalFromStyle = {left: '100%', right: '-100%'};
    }

    [to, from].map(e => e && e.style({transition: ''}));
    to && to.style(initialToStyle);
    [to, from].map(e => e && e.style({transition: '0.3s all'}));

    await sleep(0.5555)

    to && to.style({left: '0', right: '0'});
    from && from.style(finalFromStyle);
    await sleep(300);
    from && from.drop();
    typeof callback === 'function' && callback();
}


export const niceDate = function(){
    const m = month_names[this.activeMonth - 1].substring(0, 3);
    let d = new Date(this.activeDate).getDay();
    d = d === 0 ? 7 : d;
    return [days[d - 1], this.activeDay, m].join(' ');
}

export const format = function() {
    let f = this.format.trim().split(/[-\/]/).map(f => f.trim().toLowerCase());
    let ad = this.activeDate;
    
    let _date = ad.split(/[\/-]/);
    if(f.length !== 3) return ad;

    let d = f.filter(f => f.startsWith('d'));
    let m = f.filter(f => f.startsWith('m'));
    let y = f.filter(f => f.startsWith('y'));

    if(![d, m].every(p => p && p.length == 1 && p[0].length <= 2)) return ad;
    if(!(y.length === 1 && y[0] && y[0].length <= 4 && y[0].length >= 2)) return ad;

    // So far the format is OK.

    d = d[0];
    m = m[0];
    y = y[0];
    let _d = _date[1];
    let _m = _date[0];
    let _y = _date[2];

    let f_d = d.length === 1 ? _d : (_d.length === 2 ? _d : '0' + _d);
    let f_m = m.length === 1 ? _m : (_m.length === 2 ? _m : '0' + _m);
    let f_y = _y.length >= 4 ? _y : '0'.repeat(4 - _y.length) + _y;
    let _f_y = [...f_y].reverse().slice(0, 4 - y.length).reverse().join('')

    if(Number(_f_y) != 0)
        f_y = _f_y;

    const final = new Array(3);
    final[f.indexOf(d)] = f_d;
    final[f.indexOf(m)] = f_m;
    final[f.indexOf(y)] = f_y;
   
    return final.join(this.format.split('-').length === 3 ? '-' : '/');
}
