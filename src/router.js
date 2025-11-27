import { createRouter, createWebHistory } from 'vue-router'
import generalLoginComponent from "./login/general-login-component.vue";
import profileView from "./shared/views/profile-view.vue";
import EditProfile from "./shared/views/EditProfile.vue";
import Support from "./shared/views/Support.vue";
import registerIncident from "@/shared/views/register-incident.vue";
import newproject from "./shared/views/newproject.vue";
import comboDetail from "@/shared/views/ComboDetail.vue";
import PropertyDetail from "@/shared/views/PropertyDetail.vue";
import MyProperties from "@/shared/views/MyProperties.vue";
import AddProperty from "@/shared/views/AddProperty.vue";
import Billing from "@/shared/views/Billing.vue";
import Alerts from "@/shared/views/alerts.vue";
import Dashboard from "@/shared/views/Dashboard.vue";
import Register from "@/shared/views/register.vue";
import pageNotFound from "@/shared/views/page-not-found.vue";
import ProviderDetail from "@/shared/views/ProviderDetail.vue";
import LoginComponent from "@/shared/views/login-component.vue";
import BillingProperty from "@/shared/views/BillingProperty.vue";
import Consumption from "@/shared/views/Consumption.vue";
import addbudget from "@/shared/views/addbudget.vue";
import managebudget from "@/shared/views/managebudget.vue";
import manageBudgetDetail from "@/shared/views/manageBudgetDetail.vue";

const routes = [
    { path: '/', redirect: '/login' },
    {path: '/profile', component: profileView },
    {path: '/edit-profile', component: EditProfile },
    {path: '/support',component: Support},
    {path: '/register-incident', component: registerIncident },
    {path: '/new-project', component: newproject},
    {path: '/combo/:id', component: comboDetail,props:true},
    { path: '/my-properties', component: MyProperties },
    { path: '/property/:id', component: PropertyDetail, props: true },
    {path: '/add-property', component: AddProperty },
    {path: '/billing/', component: Billing},
    {path: '/billing/:id', component: BillingProperty},
    {path: '/alerts' , component: Alerts},
    {path:'/dashboard', component: Dashboard},
    {path: '/:pathMatch(.*)*', name:'NorFound', component: pageNotFound},
    {path:'/login',component: LoginComponent,meta:{ hideSidebar: true}},
    {path: '/register', component: Register,meta: { hideSidebar: true }},
    {path: "/provider/:id",name: "ProviderDetail",component: ProviderDetail,props: true},
    {path: "/consumption",name: "Consumption",component: Consumption},
    {path: "/consumption/addbudget",name: "ConsumptionDetailAddBudget",component: addbudget,props: true},
    {path: "/consumption/managebudget",name: "ConsumptionDetailManageBudget",component: managebudget,props: true},
    { path: '/consumption/managebudget/:id', name: 'ManageBudgetDetail', component: manageBudgetDetail, props: true },



]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router