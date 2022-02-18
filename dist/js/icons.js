import $ from './lib.js';

export const Chevron = (rotate = '0deg', size = '15') => {
    return $(`
    <svg 
       xmlns = "http://www.w3.org/2000/svg" 
       width=${size} 
       height=${size} 
       fill="currentColor" 
       style="color:inherit;transform:rotate(${rotate})"
       class="trans2"
       viewBox="0 0 16 16">
       <path
         fill-rule = "evenodd"
         d = "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
       />
    </svg>
    `)

}

export const linkIcon = (size = '15') => {
    return $(`
    <svg 
       xmlns = "http://www.w3.org/2000/svg" 
       width=${size} 
       height=${size} 
       fill="none" 
       style="color:inherit;"
       stroke="black"
       viewBox="0 0 24 24">
       <path
       stroke-linecap = "round"
       stroke-linejoin = "round"
       stroke = "2"
         d = "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
       />
    </svg>
    `);
}

export const warningIcon = (size='16') => $(`
      <svg 
         xmlns="http://www.w3.org/2000/svg" 
         width=${size}
         height=${size} 
         fill="currentColor" 
         viewBox="0 0 16 16">
         <path 
          d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
`);


export const close = () => {
        return $(`
        <svg 
           xmlns = "http://www.w3.org/2000/svg" 
           width="16"
           height="16"
           fill="currentColor" 
           viewBox="0 0 16 16">
           <path
            fill-rule = "evenodd"
             d = "M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
           />
           <path
            fill-rule = "evenodd"
             d = "M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
           />
        </svg>
        `);
}

export const notificationIcon = () => {
        return $(`
        <svg 
           xmlns = "http://www.w3.org/2000/svg" 
           width="16"
           height="16"
           fill="currentColor" 
           class = "text-muted"
           viewBox="0 0 16 16">
           <path
             d = "M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
           />
        </svg>
        `);
}


export const contractIcon = () => {
        return $(`
        <svg 
           xmlns = "http://www.w3.org/2000/svg" 
           width="16"
           height="16"
           fill="currentColor" 
           viewBox="0 0 16 16">
           <path
            fill-rule = "evenodd"
             d = "M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
           />
        </svg>
        `);
}

export const expandIcon = () => {
        return $(`
        <svg 
           xmlns = "http://www.w3.org/2000/svg" 
           width="16"
           height="16"
           fill="currentColor" 
           viewBox="0 0 16 16">
           <path
             d = "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
           />
        </svg>
        `);
}