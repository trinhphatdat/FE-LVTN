
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
    Tabs,
    TabPane,
    Steps,
    Step,
    Timeline,
    TimelineItem,
    RangePicker,
    DatePicker,
    Statistic,
    Comment,
    Rate,
    Tooltip,
    Carousel,
    Switch,
    Badge,
    RadioGroup,
    Radio,
    RadioButton,
    Slider,
    FloatButtonGroup,
    FloatButton,
    BackTop,
    Image,
    ImagePreviewGroup,
    Tag,
    Dropdown,
    AutoComplete,
    Pagination,
    Form,
    FormItem,
    Modal,
    Checkbox,
    Input,
    InputNumber,
    Textarea,
    Select,
    Avatar,
    Table,
    Card,
    Menu,
    List,
    Drawer,
    Button,
    message,
    Upload,
    Popover,
    Divider,
} from 'ant-design-vue';

import App from './App.vue'
import router from './router/index.js'
import axios from 'axios';
window.axios = axios;

import './static/fontawesome-free-6.7.2-web/css/all.min.css'
import 'ant-design-vue/dist/reset.css';

import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

// Begin: Register Ant Design Vue components
app.use(Dropdown)
app.use(AutoComplete)
app.use(Pagination)
app.use(Button)
app.use(Upload)
app.use(Drawer)
app.use(List)
app.use(Menu)
app.use(Card)
app.use(Table)
app.use(Avatar)

app.use(Tabs)
app.use(TabPane)

app.use(Statistic)
app.use(DatePicker)
app.use(RangePicker)

app.use(Badge)
app.use(Switch)
app.use(Carousel)

app.use(Tooltip)
app.use(Rate)
app.use(Comment)

app.use(Timeline)
app.use(TimelineItem)

app.use(Steps)
app.use(Step)

app.use(Select)
app.use(Input)
app.use(InputNumber)
app.use(Textarea)

app.use(Checkbox)
app.use(Modal)
app.use(Form)
app.use(FormItem)
app.use(Tag)

app.use(ImagePreviewGroup)
app.use(Image)

app.use(BackTop)
app.use(FloatButton)
app.use(FloatButtonGroup)

app.use(RadioGroup)
app.use(RadioButton)
app.use(Radio)

app.use(Slider)
app.use(Popover)
app.use(Divider)
// End: Register Ant Design Vue components

app.config.globalProperties.$message = message;

