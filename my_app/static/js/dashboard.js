import thread_add from './components/thread_add.js'
import card_add from './components/card_add.js'
import profile from './components/profile.js'
import dummy_thread from './components/dummy_thread.js'
import thread_card from './components/thread_card.js'
import router_dashboard from './components/router_dashboard.js'
import nav_tab from './components/nav_tab.js'
import app_summary from './components/app_summary.js'
import dummy_card from './components/dummy_card.js'
import card_card from './components/card_card.js'
import router_card from './components/router_card.js'
import new_thread from './components/new_thread.js'
import new_card from './components/new_card.js'
import modal_thread_update from './components/modal_thread_update.js'
import modal_thread_delete from './components/modal_thread_delete.js'
import modal_card_update from './components/modal_card_update.js'
import modal_card_delete from './components/modal_card_delete.js'
import flash_msg from './components/flash_msg.js'
import login_form from './components/login_form.js'
import register_form from './components/register_form.js'
import error_page from './components/error_page.js' 
import modal_completed from './components/completed_modal.js'
import thread_chart from './components/thread_chart.js'
import all from './components/all_in_one.js'
import all_cards_in_one from './components/2.js'


const routes = [
    { path : '/profile', component : profile },      
    { path : '/summary', component : app_summary },
    { path : '/:thread_id/card', component : router_card ,props : true, name : 'card'},
    { path : '/', component : router_dashboard },
    { path : '/addthread', component : thread_add},
    { path : '/:thread_id/addcard',component : card_add ,props : true, name : 'addcard'},
    { path : '/login', component : login_form},
    { path : '/register', component : register_form},
    { path : '*', component : error_page},
    { path : '/magic', component : all}
];

const router = new VueRouter({
    routes
})

new Vue({
    el : "#dashboard",
    props:[],
    router : router,
    data : {
        just_something : 'hcbqwihcbw',
        total_cards : 0,
        cards : [],
        all_threads : [],
        showModal: false,
        current_user :{},
    },
    methods : {

        },
    computed : {
        
    },
})


