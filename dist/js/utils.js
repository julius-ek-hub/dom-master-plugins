import $ from './lib';

export const popUpInstances = [];

export const sleep = (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout));
export const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const no_emptyObject = obj => Object.fromEntries(Object.entries(obj).filter(e => e[1]));
export const states = { zIindex: 9000 };

export const _number = (value, _default = 0) => typeof value === 'number' ? value : _default;

export const __ = function(_class, str = ''){
    return $(`<${str.toLowerCase()}/>`).addClass(_class);
};

export const Try = async(fn) =>{
    if(typeof fn !== 'function') return;
    try {
        let call = fn();
        if(call instanceof Promise) return await call;
        return call;
        
    } catch (e) {return}
};


export const bs = {
    aic: 'align-items-center',
    jcc: 'justify-content-center',
    jce: 'justify-content-end',
    oh: 'overflow-hidden',
    oa: 'overflow-auto',
    aie: 'align-items-end',
    fc: 'flex-column',
    btn: 'btn shadow-none',
    rel: 'position-relative',
    abs: 'position-absolute',
    fixed: 'position-fixed',
    h: 'h-100',
    w: 'w-100',
    fb: 'fw-bold',
    _w: 'w-50',
    _h: 'h-50',
    nsb: 'no-scrollbar',
    bgl: 'bg-light',
    bgd: 'bg-dark',
    bgp: 'bg-primary',
    bgs: 'bg-secondary',
    df: 'd-flex',
    fs: 'flex-start',
    tl: 'text-left',
    tc: 'text-center',
    tm: 'text-muted',
    rc: 'rounded-circle',
    no_sel: 'user-select-none',
    db: 'd-block',
    b_0: 'bottom-0',
    t_0: 'top-0',
    l_0: 'start-0',
    r_0: 'end-0'
}