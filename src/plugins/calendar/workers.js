import ui from "./ui.js";
import { slide, month_names, niceDate, days, months } from "./utils.js";
import { sleep, _number } from "../../utils.js";
import $, { _string } from "../../lib.js";


const activate = (container, active) => {
    container.find('button.active').removeClass('active');
    active.addClass('active');
}

const scrollToActive = async(container) => {
    await sleep();
    container.scrollTo({top:  container.find('button.active').offsetTop() - 100});
}

const generateDays = function(container) {
    const {ui, maxAllowedYear, activeDate, activeMonth, activeYear} = this;
    const {datePickerResult, yearPicker, monthPicker} = ui;

    let _month_start_day = new Date(`${activeMonth}/1/${activeYear}`).getDay();
    
    const _create = tag => $(document.createElement(tag));
    const table = $('<table class="w-100 h-100 text-center days-table"/>');
    const tableBody = _create('tbody');
    const _week_days = days.map(d => _create('td').addClass('day-name').addChild(d))
    tableBody.addChild(_create('tr').addChild(_week_days));

    const final = [_create('tr')];

    const _push = v => {
        const btn = $('<button class="btn p-0 shadow-none rounded-circle"/>').addChild(v);
        const _nowActive = `${activeMonth}/${v}/${activeYear}`;
        const notAllowed = activeYear === maxAllowedYear && activeMonth === 9 && v > 13
        if(activeDate === _nowActive)
            btn.addClass('active');
        btn.disable(notAllowed);
        btn.click(()=> {
            if(notAllowed) return;
            activate(table, btn);
            this.activeDay = v;
            this.activeDate = _nowActive;
            datePickerResult.child(1).refill(niceDate.call(this));
            activate(yearPicker, yearPicker.find(`button[year="${activeYear}"]`));
            activate(monthPicker, monthPicker.find(`button[month="${activeMonth}"]`));
            this.onChange();
        })
        final[final.length - 1].addChild(_create('td').addChild(v ? btn: null))
    }

    _month_start_day = _month_start_day === 0 ? 7 : _month_start_day
    for(let k = 1; k < _month_start_day; k++)
        _push(null)
    
    for(let k = 1; k<= months(activeYear)[activeMonth-1]; k++){
        _push(k)
        if((k + _month_start_day - 1)%7 === 0)
            final.push(_create('tr'))
    }

    tableBody.addChild(final)
    
    table.addChild(tableBody);

    container.addChild(table)
}

const slideDatePicker = function(n = 0){
    const {ui, activeMonth, activeYear} = this;
    const { datePickerDays,  datePickerResult, datePickerSlider} = ui;

    if(this.disabled) return;

    let currentMonth = activeMonth;
    let currentYear = activeYear;
    let nextMonth =  currentMonth + n;
    let sileDirection = 'right';
    if(nextMonth === 13){
        nextMonth = 1;
        sileDirection = 'left';
        currentYear++;
    }else if(nextMonth === 0){
        nextMonth = 12;
        currentYear--;
    }else if(nextMonth > currentMonth){
        sileDirection = 'left';
    }

    this.activeMonth = nextMonth;
    this.activeYear = currentYear;
    datePickerSlider.child(1).refill(month_names[nextMonth - 1]);
    datePickerResult.child(0).refill(currentYear);

    let lastChild = datePickerDays.lastChild();
    lastChild = lastChild.exists() ? lastChild : null;

    const newDays = $('< class="position-absolute h-100 w-100 p-1"/>');
    datePickerDays.addChild(newDays);
 
    generateDays.call(this, newDays);

    const onSlid = ()=> {
        this.disabled = false;
        let case1 = (nextMonth === 12 && currentYear === this.to) || (nextMonth === 9 && currentYear === this.maxAllowedYear);
        let case2 = nextMonth === 1 && currentYear === this.from;

        datePickerSlider.child(2).disable(case1);
        datePickerSlider.child(0).disable(case2);
    }

    slide(lastChild, newDays, sileDirection, onSlid);
    this.disabled = true;
}

const pickMonth = function(){
    const {ui, maxAllowedYear, activeYear, activeMonth} = this;
    const { monthPicker, datePicker, calendarContainer} = ui;

    calendarContainer.addChild(monthPicker);
    slide(datePicker, monthPicker, 'right');

    const container = monthPicker.lastChild().child(0).child(0);
    container.truncate();
    month_names.map((mn, i) => {
        i++;
        const notAllowed = activeYear === maxAllowedYear && i > 9;
        const btn = $('<button class="btn shadow-none"/>').addChild(mn);
        btn.attr({month: i})
        container.addChild(btn);
        if(i === activeMonth)
            btn.addClass('active');
        if(notAllowed)
            btn.disable();
        btn.click(async()=> {
            if(notAllowed) return;
            activate(container, btn)
            let direction = this.activeMonth > i ? 'right' : 'left';
            this.activeMonth = i;
            calendarContainer.addChild(datePicker);
            slide(monthPicker, datePicker, direction);
            await sleep(1);
            slideDatePicker.call(this);
        })
    });

    scrollToActive(container.parent(1))
}

const pickYear = function(){
    const {ui, activeYear: ac, from, to, maxAllowedYear, cache} = this;
    const { datePicker, yearPicker, calendarContainer } = ui;

    let current = ac - 50;
    current = current < 1 ? 1 : current; // For positive scroll
    let _current = current - 1; // For negative scroll

    calendarContainer.addChild(yearPicker);
    slide(datePicker, yearPicker, 'right');
    const container = yearPicker.lastChild().child(0).child(0);
    const scroller = container.parent(1);
    
    if(cache.includes('year')) {
        scrollToActive(scroller)
        return;
    }
    
    container.truncate(); // Just to be sure it's empty

    const addYears = (negative) => {
        
        const doAdd = (value, addChild)=> {
            if(value > maxAllowedYear || value > to || value < from) return;
            const btn = $('<button class = "btn shadow-none"/>').style({width: '30%'}).addChild(value);
            btn.attr({year: value});
            addChild(btn);
            if(value === this.activeYear)
                btn.addClass('active');
            btn.click(async()=> {
                activate(container, btn);
                this.activeYear = value;
                this.activeMonth = 1;
                calendarContainer.addChild(datePicker);
                slide(yearPicker, datePicker, 'left');
                await sleep(1)
                slideDatePicker.call(this);
            })
        }

        if(negative){
            for(let i = _current; (i > _current - 99 && i >= this.from);  i--)
                doAdd(i, btn => btn.prependTo(container))
            _current -=101;
        }else{
            for(let i = current; (i <= current + 99 && i <= this.to); i++)
                doAdd(i, btn => container.addChild(btn))
            current +=100;
        }

    }

    addYears();

    scroller.on('scroll', e => {
        if(e.percentageYScroll >= 100 && current < to)
            addYears();
        else if(e.percentageYScroll === 0 && _current > from){
           addYears(true);
            scroller.scrollTo({top: 100})
        }
    });

    this.cache.push('year');
    scrollToActive(scroller)
}

export const getProps = function(customProps){
    const defaultDate = new Date();
    
    const props = {
        maxAllowedYear: 275760,
        from: 1,
        to: 275760,
        ui: ui(),
        cache: []
    };

    customProps = customProps && typeof customProps === 'object' ? customProps : {};
    let {activeDate: ad, from, to, theme, format} = customProps;
    from = _number(from, 1);
    to = _number(to, props.maxAllowedYear);
    props.theme = _string(theme, 'light');
    props.format = _string(format, 'MM/DD/YYYY');
    
    let activeDate = new Date(typeof ad === 'string' ? ad : defaultDate.toDateString());
    
    
    if(from > 0 && from <= props.maxAllowedYear)
        props.from = from;
    if(to >= props.from && to <= props.maxAllowedYear)
        props.to = to;
    if(String(activeDate) === 'Invalid Date'){
        
        const dy = defaultDate.getFullYear();
        if(dy <= props.to && dy >= props.from)
            props.activeDate = defaultDate.toLocaleDateString();
        else 
            props.activeDate = `1/1/${props.from}`;
        
    }else {
        let y = activeDate.getFullYear();
        let m = activeDate.getMonth();
        let d = activeDate.getDate();
        if(y <= props.to && y >= props.from){
            if(y === props.maxAllowedYear && activeDate.getMonth() > 8)
                props.activeDate = `1/1/${y}`;
            else 
                props.activeDate = `${m+1}/${d}/${y}`;
        }else{
            props.activeDate = `1/1/${props.from}`;
        }
    }
    
    const split = new Date(props.activeDate);
    props.activeYear = split.getFullYear();
    props.activeMonth = split.getMonth() + 1;
    props.activeDay = split.getDate();

    return props;
}


const getCalendarMonth = function(slideDirection) {
    const {activeYear : ay, activeMonth: am, maxAllowedYear: may, from, to} = this;

    if(slideDirection === 'right'){
        if(ay === from && am === 1) return;
            slideDatePicker.call(this, -1);
    } else {
        let exceptionalCase1 = (ay === to && am === 12);
        let exceptionalCase2 = (ay=== may && am === 9);
        if(exceptionalCase1 || exceptionalCase2) return;
        slideDatePicker.call(this, 1)
    }
        
}

export default function(container){

    const { 
        datePickerResult, 
        datePickerSlider, 
        datePickerFooter, 
        calendarContainer, 
        datePickerDays 
    } = this.ui;

    $(container).addChild(calendarContainer.addClass(this.theme));
    
    slideDatePicker.call(this);

    datePickerResult.child(1).refill(niceDate.call(this));

    datePickerResult.child(0).click(pickYear.bind(this));
    datePickerSlider.child(1).click(pickMonth.bind(this));

    datePickerSlider.child(0).click(getCalendarMonth.bind(this, 'right'));
    datePickerSlider.child(2).click(getCalendarMonth.bind(this, 'left'));
    datePickerDays.on('swipe', async(e) => {
        await sleep(100)
        getCalendarMonth.call(this, e.direction)
    });

    datePickerFooter.child(0).click(this.onOk);
    datePickerFooter.child(1).click(this.unMount);
}
