const thread_add = Vue.component('thread-add',{
    template : `
    <div class="container">
    Thread name : <input type="text" class="form-control" v-model="thread_name" required />  <br>
    Thread description : <input type="text" class="form-control" v-model="thread_description" /> <br>
    <button v-on:click.prevent="new_thread" class='btn btn-lg btn-block btn-primary'> 
        Submit
    </button>
    <i class="bi bi-cloud-arrow-up-fill" v-bind:class="savedIconClass"></i> 
    </div>
    
    `,
    data : function(){
        return {
            thread_name : "",
            thread_description : "",
            savedIconClass : "text-success",
            message : [],
            current_user :{}
        }
    },
    methods :{
        new_thread : async function(){
            console.log(localStorage.getItem('access_token').slice(1,-1))
            // API CALL
            this.savedIconClass = "text-warning";
            fetch("http://127.0.0.1:5000/api/thread",{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("access_token").slice(1,-1),
                },
                body : JSON.stringify({ 
                "name": this.thread_name,
                "owner":this.current_user.id,
                "description":this.thread_description})
                })
                .then( response => {

                    if (response.ok){ 
                        this.$emit('refresh_page',true)
                        this.$router.push('/')
                    } else {
                        return response.json()
                    }
                })
                .then((data_)=>{})
                .catch()
        }
        
    },
    async mounted(){
        const rawCurrentUser = await fetch(
            "http://127.0.0.1:5000/api/current_user"
        );
        if (rawCurrentUser.ok) {
        const current_user = await rawCurrentUser.json();
        this.current_user = current_user;
        } else {
        alert("Could not fetch current user !! LOGIN...!!");
        }
    }
})

export default thread_add

