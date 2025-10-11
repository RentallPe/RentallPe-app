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
import pageNotFound from "@/shared/views/page-not-found.vue";

const routes = [
    { path: '/', component: generalLoginComponent },
    { path: '/login-customer', component: generalLoginComponent },
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
    {path: '/alerts' , component: Alerts},
    {path:'/dashboard', component: Dashboard},
    {path: '/:pathMatch(.*)*', name:'NorFound', component: pageNotFound},



]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router