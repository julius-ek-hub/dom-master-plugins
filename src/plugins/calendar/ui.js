
import $ from '../../lib.js';
import { bs } from '../../utils.js';
import { slide} from './utils.js';
import { Chevron } from '../../icons.js';

const {aic, jce, df, rel, abs, h, w, b_0, oh} = bs;

export default () => {
    
    const picker = (_class, left = '-100%', right = '100%') => {
        const container = $('</>');
        container.addClass([abs, h, w, b_0, _class])
        container.style({left, right})
        return container;
    };

    const calendarContainer = $('</>').addClass([h, w, rel, 'calendar border shadow user-select-none', oh]);
    const datePicker = picker('date-picker', '0', '0');
    const yearPicker = picker('year-picker d-flex flex-column');
    const monthPicker = picker('month-picker d-flex flex-column');

    const navButton = rotate => $('<button class = "btn btn-sm shadow-none"/>').addChild(Chevron(rotate, '25'));

    const withBackToDatePicker = (title, from) =>  {
        const container = $('</>').addClass([df, aic, 'p-2 with-pack-button']);
        const btn = navButton('180deg').addClass('rounded-circle p-2');
        const _title = $('<span class="ms-2"/>').addChild(title);
        container.addChild([btn, _title]);
        btn.click(()=> {
            calendarContainer.addChild(datePicker);
            slide(from, datePicker, 'left')
        });
        return container;
    }
    
    const datePickerResult = $('< class="w-100 date-picker-result"/>').addChild([
        $('<button class = "btn shadow-none p-0 text-start ps-1"/>'),
        $('<h2 class="ps-1"/>')
    ]);
    
    const datePickerSlider = $('</>').addClass([df, 'pt-2 justify-content-evenly date-slider ps-2 pe-2', aic]).addChild([
        navButton('180deg').addClass('rounded-circle'),
        $('<button class="text-center btn shadow-none flex-fill ms-1 me-1"/>'),
        navButton().addClass('rounded-circle')
    ]);
    
    const datePickerDays = $('</>').addClass([rel, 'date-picker-days flex-fill pt-1 ps-2 pe-2']);
    
    const datePickerFooter = $('</>').addClass(['date-picker-footer ps-2 pe-2', df, jce, aic]).addChild([
        $('<button class = "btn shadow-none"/>').addChild('OK'),
        $('<button class = "btn shadow-none ms-2"/>').addChild('CANCEL'),
    ]);
    
    const datePickerBody = $('< class="d-flex h-100 flex-column"/>');
    datePickerBody.addChild([
        datePickerResult, 
        datePickerSlider, 
        datePickerDays,
        datePickerFooter
    ]);
    
    
    const yearPickerBody = $('< class = "flex-fill overflow-auto"/>');
    yearPickerBody.addChild([
        $('< class = "mb-3"/>').addChild([
            $('< class = "d-flex flex-wrap h-100 justify-content-evenly p-1"/>')
        ])
    ]);
    
    
    const monthPickerBody = $('< class = "flex-fill overflow-auto"/>');
    monthPickerBody.addChild([
        $('< class = "mb-3"/>').addChild([
            $('< class = "d-flex h-100 flex-column p-1"/>')
        ])
    ]);
    
    datePicker.addChild(datePickerBody);
    yearPicker.addChild([withBackToDatePicker('Years', yearPicker), yearPickerBody]);
    monthPicker.addChild([withBackToDatePicker('Months', monthPicker), monthPickerBody]);
    calendarContainer.addChild(datePicker);
    

    return {
        calendarContainer,
        monthPicker, 
        datePicker, 
        yearPicker, 
        datePickerResult, 
        datePickerSlider,
        datePickerDays, 
        datePickerFooter
    }
}