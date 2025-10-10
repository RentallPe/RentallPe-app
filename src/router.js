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
    { path: '/property/:id', component: PropertyDetail, props: true }



]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
