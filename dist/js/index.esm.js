 import domMaster from "./lib";

 import modal from './plugins/modal.js';
 import Alert from './plugins/alert.js';
 import accordion from "./plugins/accordion.js";
 import Confirm from "./plugins/confirm.js";
 import Prompt from "./plugins/prompt.js";
 import carousel from "./plugins/carousel.js";
 import card from "./plugins/card.js";
 import expandable from "./plugins/expandable.js";
 import form from './plugins/form/index.js';
 import collapse from "./plugins/collapse.js";
 import animateScroll from "./plugins/animate-scroll.js";
 import mountAt from "./plugins/mount-at.js";
 import movable from "./plugins/movable.js";
 import nestedCollapse from "./plugins/nested-collapse/index.js";
 import offCanvas from "./plugins/offcanvas.js";
 import partition from "./plugins/partition.js";
 import toast from "./plugins/toast.js";
 import _window from "./plugins/window.js";
 import Calendar from "./plugins/calendar/index.js";
 import pickFile from "./plugins/pick-file.js";
 
 domMaster.modal = modal;
 domMaster.alert = Alert;
 domMaster.confirm = Confirm;
 domMaster.prompt = Prompt;
 domMaster.accordion = accordion;
 domMaster.carousel = carousel;
 domMaster.card = card;
 domMaster.expandable = expandable;
 domMaster.form = form;
 domMaster.collapse = collapse;
 domMaster.animateScroll = animateScroll;
 domMaster.mountAt = mountAt;
 domMaster.movable = movable;
 domMaster.nestedCollapse = nestedCollapse;
 domMaster.offCanvas = offCanvas;
 domMaster.partition = partition;
 domMaster.toast = toast;
 domMaster.window = _window;
 domMaster.Calendar = Calendar;
 domMaster.pickFile = pickFile;

export default domMaster;