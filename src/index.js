 import $ from './lib.js';

 import modal from './plugins/modal.js';
 import Alert from './plugins/alert.js';
 import accordion from "./plugins/accordion.js";
 import Confirm from "./plugins/confirm.js";
 import Prompt from "./plugins/prompt.js";
 import carousel from "./plugins/carousel.js";
 import card from "./plugins/card.js";
 import expandable from "./plugins/expandable.js";
 import form from './plugins/form/index.js';
 import collapsible from "./plugins/collapse.js";
 import animateScroll from "./plugins/animate-scroll.js";
 import mountAt from "./plugins/mount-at.js";
 import movable from "./plugins/movable.js";
 import nestedCollapse from "./plugins/nested-collapse/index.js";
 import offCanvas from "./plugins/offcanvas.js";
 import tab from "./plugins/tab.js";
 import toast from "./plugins/toast.js";
 import _window from "./plugins/window.js";
 import Calendar from "./plugins/calendar/index.js";
 import pickFile from "./plugins/pick-file.js";
 
 $.modal = modal;
 $.alert = Alert;
 $.confirm = Confirm;
 $.prompt = Prompt;
 $.accordion = accordion;
 $.carousel = carousel;
 $.card = card;
 $.expandable = expandable;
 $.form = form;
 $.collapse = collapsible;
 $.animateScroll = animateScroll;
 $.mountAt = mountAt;
 $.movable = movable;
 $.nestedCollapse = nestedCollapse;
 $.offCanvas = offCanvas;
 $.tab = tab;
 $.toast = toast;
 $.window = _window;
 $.Calendar = Calendar;
 $.pickFile = pickFile;

export default $;
