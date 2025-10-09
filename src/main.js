import {createApp} from 'vue'
import './style.css'
import App from './app.vue'
import i18n from "./i18n.js";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Material from '@primeuix/themes/material';
import PrimeVue from 'primevue/config';
import {
    Avatar,
    Button, ButtonGroup,
    Calendar,
    Card,
    Checkbox,
    Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable,
    Dialog,
    DialogService,
    Divider,
    Drawer, Dropdown,
    FileUpload,
    FloatLabel,
    IconField,
    InputIcon,
    InputMask,
    InputNumber,
    InputText,
    Menu,
    Menubar, Message,
    Rating,
    Row,
    Select,
    SelectButton,
    Sidebar,
    Steps,
    Tag,
    Textarea,
    Toast,
    ToastService,
    Toolbar,
    Tooltip
} from "primevue";
import router from "./router.js";
import pinia from "./pinia.js";

createApp(App)
    .use(i18n)
    .use(PrimeVue, {theme: {preset: Material}, ripple: true})
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-button',         Button)
    .component('pv-card',           Card)
    .component('pv-column',         Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox',       Checkbox)
    .component('pv-data-table',     DataTable)
    .component('pv-dialog',         Dialog)
    .component('pv-select',         Select)
    .component('pv-select-button',  SelectButton)
    .component('pv-file-upload',    FileUpload)
    .component('pv-float-label',    FloatLabel)
    .component('pv-icon-field',     IconField)
    .component('pv-input-icon',     InputIcon)
    .component('pv-input-text',     InputText)
    .component('pv-input-number',   InputNumber)
    .component('pv-menu',           Menu)
    .component('pv-rating',         Rating)
    .component('pv-row',            Row)
    .component('pv-drawer',         Drawer)
    .component('pv-tag',            Tag)
    .component('pv-textarea',       Textarea)
    .component('pv-toolbar',        Toolbar)
    .component('pv-toast',          Toast)
    .directive('tooltip',           Tooltip)
    .component('PvCard', Card)
    .component('PvButton', Button)
    .component('PvSelectButton', SelectButton)
    .component('PvSidebar', Sidebar)
    .component('PvAvatar', Avatar)
    .component('PvMenu', Menu)
    .component('PvMenubar', Menubar)
    .component('PvToolbar', Toolbar)
    .component('PvDataTable', DataTable)
    .component('PvColumn', Column)
    .component('PvSteps', Steps)
    .component('PvInputText', InputText)
    .component('PvDivider', Divider)
    .component('PvCalendar', Calendar)
    .component('PvRating', Rating)
    .component('PvInputNumber', InputNumber)
    .component('PvInputMask', InputMask)
    .component('PvMessage', Message)
    .component('PvButtonGroup', ButtonGroup)
    .component('PvIconField', IconField)
    .component('PvInputIcon', InputIcon)
    .component('PvTextarea', Textarea)
    .component('PvDropdown', Dropdown)
    .use(router)
    .mount('#app')
