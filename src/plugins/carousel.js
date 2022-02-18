import $, {_boolean, isElement, _array, _object, toElement, _bootstrap} from "../lib.js";

import { __, bs} from "../utils.js";
const { w, h, df, jcc, aic } = bs;

/**
 * ------------------------------------------------------------------------------
 * Generate a fresh Bootstrap 5 carousel without having to write any HTML tags 
 * -------------------------------------------------------------------------------
 * @param {[Element | Text | {
 * item: Element | Text | URL,
 * interval: Number | Boolean,
 * type: 'picture' | 'video' | 'other',
 * autoplay: Boolean,
 * controls: Boolean
 * }]} items
 * 
 * @param {{
 * active: Number,
 * autostart: Boolean,
 * speed: Number,
 * transition: 'fade' | 'slide',
 * interval: Number | Boolean,
 * arrows: Boolean,
 * indicators: Boolean,
 * hover: Boolean,
 * keyboard: Boolean,
 * touch: Boolean,
 * cycle: Boolean,
 * theme: 'dark' | 'light'
 * }} props 
 * @see https://www.247-dev.com/projects/dom-master/plugins/carousel
 */

const carousel = (items, props) => {

    let {
        active,
        transition: tr,
        arrows,
        indicators: ind,
        interval,
        autostart,
        hover,
        keyboard,
        touch,
        cycle,
        theme,
        speed
    } = _object(props);

        const themes = {
            dark: { bg: 'dark', txt: 'light' },
            light: { bg: 'light', txt: 'dark' }
        };
        cycle = _boolean(cycle, true);
        if (!_array(items, null)) throw new Error('Carousel expects valid items')
        const trans = { slide: 'slide', fade: 'carousel-fade' };
        tr = trans[(tr || '').toLowerCase()] || 'slide';
        let carouselContainer = __(`carousel bg-${(themes[theme] ||{bg:'light'}).bg} carousel-${(themes[theme] || {txt: 'dark'}).txt} ${tr}`).addClass([h, w]);
        const inner = __('carousel-inner').addClass([h, w]);
        const indicatorsContainer = __('carousel-indicators');
        const indicators = items.map((slide, index) => {
            const _bt = $('<button/>');
            let act = index == (typeof active === 'number' ? active : 0);
            act && _bt.addClass('active').attr({ 'aria-current': "true" });
            return _bt.attr({
                'data-bs-target': ''
            }).on('click', () => _carousel.to(index))
        });
        let playingSlide = null;
        let _carousel = new _bootstrap.Carousel(carouselContainer.plain(0), {
            wrap: cycle,
            interval: interval === true ? 5000 : typeof interval === 'number' ? interval : _boolean(interval, 5000),
            touch: _boolean(touch, true),
            keyboard: _boolean(keyboard, true),
            pause: hover === 'hover' ? 'hover' : _boolean(hover, 'hover')
        })
        const next = __('carousel-control-next', 'button').on('click', function() { _carousel.next() });
        const prev = __('carousel-control-prev', 'button').on('click', function() { _carousel.prev() });
        inner.addChild(items.map((item, index) => {
            let slide_ = __([`carousel-item`, h, w]);
            let trans = item.interval;
            index == (active || 0) && slide_.addClass('active');
            if (item && typeof item === 'object' && item.item) {
                let type = typeof item.type === 'string' ? item.type : '';
                let fill = item.fill;
                let _item = item.item;
                let controls = item.controls;
                let autoplay = item.autoplay;
                if (['picture', 'video'].includes(type) && _item.split(' ').length === 1) {
                    item = $('<img/>').attr({ src: _item });
                    if (type === 'video') {
                        item = $('<video/>').attr({ src: _item, _autoplay: _boolean(autoplay, true) });
                        item.plain(0).controls = _boolean(controls, true);
                    }
                    if (_boolean(fill, true))
                        item.addClass([w, h]).style({ objectFit: 'cover' });
                    else
                        item.style({
                            maxWidth: '100%',
                            maxHeight: '100%'
                        })
                } else
                    item = item.item;
            }

            if (trans && typeof trans === 'number')
                slide_.attr({ 'data-bs-interval': trans });

            slide_.addChild(__([h, w, df, jcc, aic]).addChild(item))
            if(typeof speed == 'number')
               slide_.style({transitionDuration: `${speed}ms`});
            return slide_;
        }));

        indicatorsContainer.addChild(indicators);

        next.addChild([
            __('carousel-control-next-icon', 'span').attr({ 'aria-hidden': 'true' }),
            __('visually-hidden', 'span').addChild('Next')
        ])

        prev.addChild([
            __('carousel-control-prev-icon', 'span').attr({ 'aria-hidden': 'true' }),
            __('visually-hidden', 'span').addChild('Previous')
        ])

        const on = (event, callback) => {
            const cbs = {
                slide: 'slide.bs.carousel',
                slid: 'slid.bs.carousel'
            }
            carouselContainer.on(cbs[event], callback);
            return { on };
        }

        _boolean(ind, true) && carouselContainer.addChild(indicatorsContainer);
        carouselContainer.addChild(inner);
        _boolean(arrows, true) && carouselContainer.addChild([prev, next]);
        on('slid', function(e) {
            $(indicators[e.from]).removeClass('active');
            $(indicators[e.to]).addClass('active');
        })
        on('slid', e => {
            if (playingSlide) {
                playingSlide.pause();
                playingSlide.currentTime = 0;
            }
            let vid = $(_carousel._items[e.to]).child(0).child(0);
            if (!isElement(vid) || vid.tagName() != 'VIDEO' || vid.attr('_autoplay') != 'true') return;
            vid.play().then(() => {
                playingSlide = vid;
                _carousel.pause();
                vid.on('ended', function(){
                    if(!cycle) return;
                    _carousel.cycle();
                    _carousel.next();
                })
            }).catch(e => {});
        })
        _carousel._items = [$('</>').plain(0)];
        _boolean(autostart, true) && _carousel.cycle();
    
    return {
        to(n){
            return _carousel.to(n);
        },
        next(){
            return _carousel.next();
        },
        prev(){
            return _carousel.prev();
        },
        cycle(){
            return _carousel.cycle();
        },
        pause(){
            return _carousel.pause();
        },

        /**
         * Attach eventListeners to modal
         * @param {'slide' | 'slid'} event 
         * @param {Function} callback 
         */

        on(event, callback){
           return on(event, callback);
        },
        container: carouselContainer,
        appendTo(container){
           return carouselContainer.appendTo(container)
        },
        i: _carousel
    };
}

carousel.init = function(existing){
    if (isElement(existing)) {
        let _carousel = _bootstrap.Carousel.getOrCreateInstance(toElement(existing)[0]);
        _carousel.cycle();
        return _carousel;
    } 
    else 
        throw new Error('Invalid element')
}

export default carousel;