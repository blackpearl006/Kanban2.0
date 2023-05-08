const card_add = Vue.component('card-add',{
    props : ['thread_id'],
    template : `
    <div class="container">
    Card data : <input type="textarea" class="form-control" v-model="card_data" required />  <br>
    Card Label : <input type="text" class="form-control" v-model="card_label" /> <br>
    Deadline : <input type="date" class="form-control" v-model="deadline"/> <br>
    <button v-on:click.prevent="new_card" class='btn btn-lg btn-block btn-primary'> 
        Submit
    </button>
    <i class="bi bi-cloud-arrow-up-fill" v-bind:class="savedIconClass"></i> 
    </div>
    
    `,
    data : function(){
        return {
            card_data : "",
            card_label : "",
            deadline : 0,
            messages : [],
            savedIconClass : "text-success",
            redirect_url : "/"+this.thread_id+"/card"
        }
    },
    methods : {
        new_card : function(){
            this.savedIconClass = "text-warning";
            fetch("http://127.0.0.1:5000/api/newcard/"+this.thread_id,{           
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({ 
                "data": this.card_data,
                "label" : this.card_label,
                "deadline":this.deadline})
                })
                .then( response => {                    
                    if (response.ok){ 
                        this.$router.push('/')
                        response.json()
                } else {
                    return response.json()
                }})
                .then( data =>{
                console.log("Sucess data : ",data);
                this.savedIconClass ="text-success"
                })
                .catch(error=>{
                console.log("error", error);
                this.savedIconClass="text-danger"
                })

            this.card_data = "",
            this.card_label = "",
            this.deadline = ""
            this.$router.push(this.redirect_url)
        }
    }
})

export default card_add