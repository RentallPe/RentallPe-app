import { createRouter, createWebHistory } from 'vue-router'
import profileView from "./IAM/presentation/views/profile-view.vue";
import EditProfile from "./IAM/presentation/views/EditProfile.vue";
import Support from "./Monitoring/presentation/views/Support.vue";
import registerIncident from "@/Monitoring/presentation/views/register-incident.vue";
import newproject from "./Monitoring/presentation/views/newproject.vue";
import comboDetail from "@/Rental/presentation/views/ComboDetail.vue";
import PropertyDetail from "@/Property/presentation/views/PropertyDetail.vue";
import MyProperties from "@/Property/presentation/views/MyProperties.vue";
import AddProperty from "@/Property/presentation/views/AddProperty.vue";
import Billing from "@/Rental/presentation/views/Billing.vue";
import Alerts from "@/Monitoring/presentation/views/alerts.vue";
import Dashboard from "@/Rental/presentation/views/dashboard.vue";
import Register from "@/IAM/presentation/views/register.vue";
import pageNotFound from "@/shared/views/page-not-found.vue";
import ProviderDetail from "@/Provider/presentation/views/ProviderDetail.vue";
import LoginComponent from "@/IAM/presentation/views/login-component.vue";
import MyCombos from "@/Provider/presentation/views/MyCombos.vue";
import AddCombo from "@/Provider/presentation/views/AddCombo.vue";
import EditCombo from "@/Provider/presentation/views/EditCombo.vue";
import PaymentProvider from "@/Provider/presentation/views/PaymentProvider.vue";
import Subscription from "./Subscription/presentation/views/subscription.vue";
import ProjectDetail from "@/Monitoring/presentation/views/ProjectDetail.vue";
import ProjectDevices from "@/Monitoring/presentation/views/ProjectDevices.vue";
import Projects from "@/Monitoring/presentation/views/Projects.vue";


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
    {path: '/alerts' , component: Alerts},
    {path:'/dashboard', component: Dashboard},
    {path: '/:pathMatch(.*)*', name:'NorFound', component: pageNotFound},
    {path:'/login',component: LoginComponent,meta:{ hideSidebar: true}},
    {path: '/register', component: Register,meta: { hideSidebar: true }
    },
    { path: '/my-combos', component: MyCombos },
    {path: "/provider/:id",name: "ProviderDetail",component: ProviderDetail,props: true},
    { path: "/add-combo", component: AddCombo },
    { path: "/edit-combo/:id", component: EditCombo, props: true },
    { path: "/payment", component: PaymentProvider },
    { path: '/subscription', component: Subscription },
    { path: "/projects", name: "Projects", component: Projects },
    { path: "/projects/:id", component: ProjectDetail, props: true },
    { path: "/projects/:id/devices", component: ProjectDevices, props: true },










]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router