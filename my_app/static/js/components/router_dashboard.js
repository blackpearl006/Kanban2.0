const router_dashboard = {
    template : `
    <div>
    <div class="row row-cols-1 row-cols-md-3">
    <div v-if="all_threads.length>0" v-for="(thread,index) in all_threads" :key="index+1">
        <thread-card :thread="thread" v-on:refresh_page="refresh">{{index+1}}</thread-card>
    </div>
    </div>
        <div class="col mb-4" id="style_var">
        <div class="card h-100">
        <div class="card-body">
            <router-link to="/addthread" class="d-grid gap-2 btn btn-primary active" v-on:refresh_page="refresh" >Add Thread</router-link>
        </div>
        </div>
    </div>
    </div>
    `,
    data : function(){
        return{ 
            all_threads :[] ,
        }
    },
    mounted() {
        let logged_in = sessionStorage.getItem('Logged IN')
        if (logged_in=='True'){
            fetch('/api/allthread')
            .then((list_threads)=>list_threads.json())
            .then((data)=>{this.all_threads=data})
            .catch((error)=>console.log(error));
        }
        else{
            alert('Login to access')
            this.$router.push('/login')
        }
    },
    methods : {
        refresh(bool){
            if(bool==true){
            fetch('/api/allthread')
            .then((list_threads)=>list_threads.json())
            .then((data)=>{this.all_threads=data})
            .catch((error)=>console.log(error));
            }
        }
    }
}
export default router_dashboard