const all = Vue.component('all',{
    props : [],
    template : `
    <div>
    <div class="row row-cols-1 row-cols-md-3" id="style_var" v-if="all_threads.length>0">
        <div v-for="(thread,index) in all_threads" :key="index+1">
            <div class="col mb-4">
                <div class="card h-100">
                    <div class="card-body">
                    <h3 class="card-title">{{thread.name}}</h3>
                        <div class="card-label">
                            <p>{{thread.description}}</p>
                        </div>
                        <div class="card-data">
                            <div class="circle">{{index+1}}</div>
                        </div>
                        <div class="card-buttons btn-group btn-group-justified">
                            <button id="show-modal" @click="showModal_update = true" type="button" class="btn btn-outline-info">Update</button>
                            <div v-if="showModal_update">
                                <transition name="modal">
                                    <div class="modal-mask">
                                    <div class="modal-wrapper">
                                        <div class="modal-container">
                            
                                        <div class="modal-header">
                                            <h3>{{thread.name}}</h3>
                                        </div>
                            
                                        <div class="modal-body">
                                            <slot name="body">
                                            Updated name : <input type="text" v-model="upd_thread_name"/>
                                            <br>
                                            Updated Description : <input type="text" v-model="upd_thread_desc"/>
                                            </slot>
                                        </div>
            
                                        <div class="modal-footer">
                                            <slot name="footer">
                                            <!--default footer-->
                                            <button class="modal-default-button" @click="showModal_update = false;">
                                                Cancel 
                                            </button>
                                            <button class="modal-default-button" @click="showModal_update = false; update_thread(thread); ">
                                                Submit 
                                            </button>
                                            </slot>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </transition>
                            </div>
                            <button id="show-modal" @click="showModal_delete = true" type="button" class="btn btn-outline-danger">Delete</button>
                            <div v-if="showModal_delete">
                                <transition name="modal">
                                    <div class="modal-mask">
                                    <div class="modal-wrapper">
                                        <div class="modal-container">
                            
                                        <div class="modal-header">
                                            <h3>{{thread.name}}</h3>
                                        </div>
                            
                                        <div class="modal-body">
                                            <slot name="body">
                                                Are you sure you want to delete this thread along all its cards ?
                                                Name : {{thread.name}}
                                            </slot>
                                        </div>
                            
                                        <div class="modal-footer">
                                            <slot name="footer">
                                            <!--default footer-->
                                            <button class="modal-default-button" @click="showModal_delete = false;">
                                                Cancel 
                                            </button>
                                            <button class="modal-default-button" @click="showModal_delete = false; delete_thread(thread); ">
                                                Submit 
                                            </button>
                                            <i class="bi bi-cloud-arrow-up-fill" ></i>
                                            </slot>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </transition>
                            </div>
                            <button @click="allcardscsv(thread.id)" type="button" class="btn btn-outline-warning">Export cards</button>
                        </div>
                        <br>
                        <br>
                        <br>
                        <all-card :thread="thread"></all-card>
                    </div>
                    <div class="card-footer">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <new-thread id="style_var"></new-thread>
    </div>
    `,
    data : function(){
        return {
            all_threads:[],
            current_user:{},
            thread_name : "",
            thread_description : "",
            id : {},
            showModal: false,
            showModal_update : false,
            showModal_delete : false,
            item : 0,
            status : {},
            upd_thread_name : "",
            upd_thread_desc : "",
            message : {},
            
        }
    },
    async mounted(){
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
        const rawCurrentUser = await fetch(
            "http://127.0.0.1:5000/api/current_user"
        );
        if (rawCurrentUser.ok) {
        const current_user = await rawCurrentUser.json();
        this.current_user = current_user;
        } else {
        alert("Could not fetch current user !! LOGIN...!!");
        }
    },
    methods : {
        allcardscsv(id){
            fetch("http://127.0.0.1:5000/api/allcardcsv/"+id)
            .then( response => response.json())
            .then( data => this.item=data)
            .catch(error=>{console.log("error", error);
                })
        },
        update_thread : function(obj){
            fetch("http://127.0.0.1:5000/api/thread/"+obj.name,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({ 
                "name": this.upd_thread_name,
                "description" : this.upd_thread_desc
              })
                })
            .then((thread)=>thread.json())
            .then((data)=>{})
            .catch((error)=>{console.log(error)})

            fetch('/api/allthread')
            .then((list_threads)=>list_threads.json())
            .then((data)=>{this.all_threads=data})
            .catch((error)=>console.log(error));
        },
        delete_thread : function(obj){
            fetch("http://127.0.0.1:5000/api/thread/" +obj.name,{
                method : 'DELETE',
            })
            .then((response)=>response.json())
            .then((data)=>{this.message=data})
            .catch((error)=>{console.log(error)})

            fetch('/api/allthread')
            .then((list_threads)=>list_threads.json())
            .then((data)=>{this.all_threads=data})
            .catch((error)=>console.log(error));
        }
    }
})

export default all