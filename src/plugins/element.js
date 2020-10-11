import Vue from 'vue'
import {
    // 导入表单系列组件
    Button,
    Form,
    FormItem,
    Input,
    // 导入弹框提示组件
    Message,
    MessageBox,
    // Home组件需要导入的相关子组件
    Container,
    Header,
    Aside,
    Main,
    // Home组件中左侧菜单栏组件
    Menu,
    Submenu,
    MenuItem,
    // Home组件中main区域面包屑导航
    Breadcrumb,
    BreadcrumbItem,
    // Home组件中main区域卡片视图
    Card,
    // 栅格布局
    Row,
    Col,
    // 表格相关
    Table,
    TableColumn,
    // 开关组件
    Switch,
    // 文字提示
    Tooltip,
    // 分页
    Pagination,
    // 对话框
    Dialog,
    // tag标签
    Tag,
    // 树形组件
    Tree,
    // 下拉列表组件
    Select,
    Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
