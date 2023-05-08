const card_card = Vue.component('card-card',{
    props :['card'],
    template :`
    <div class="col mb-4">
        <div class="card h-100">
            <div class="card-body">
            <h5 class="card-title" v-if="fetch_card.status">COMPLETED</h5>
            <h5 class="card-title" v-else>Due on : {{fetch_card.deadline | slice }}</h5>
                <div class="card-label">
                    <p>Label : {{fetch_card.label}}</p>
                </div>
                <div class="thread_circle"><slot></slot></div>
                <div class="card-data">
                    {{fetch_card.data }}
                    <br>
                    <br>
                </div>
                <div class="card-buttons btn-group btn-group-justified">
                    <button id="show-modal" @click="showModal_update = true" type="button" class="btn btn-outline-info">Update</button>
                    <modal-card-update v-show="showModal_update" @close="showModal_update = false;" :card="card" v-on:card_refresh="c_refresh">
                        <h3 slot="header">Update card</h3>
                    </modal-card-update>
                    <button id="show-modal" @click="showModal_delete = true" type="button" class="btn btn-outline-danger">Delete</button>
                    <modal-card-delete v-show="showModal_delete" @close="showModal_delete = false;" :card="card" v-on:card_refresh="c_refresh">
                        <h3 slot="header">Delete card</h3>
                    </modal-card-delete>
                    <button id="show-modal" @click="showModal_completed = true" type="button" class="btn btn-outline-warning">Completed task</button>
                    <modal-completed v-show="showModal_completed" @close="showModal_completed = false;" :card="card" v-on:card_refresh="c_refresh">
                        <h3 slot="header">Completed task </h3>
                    </modal-completed>
                </div>
                <br>
                <div class="card-buttons btn-group dropup">
                    <br>
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Move to other thread
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="thread in all_threads_card" a class="dropdown-item" @click="change_thread(thread.id)">{{thread.name}}</li>
                    </ul>
                </div>
            </div>

            <div class="card-footer">
                <div class="completed_tag" v-if="!completed"> {{last_modified}} </div>
                <div class="completed_tag" v-else> COMPLETED TASK </div>
            </div>
        </div>
    </div>
    `,
    data : function(){
        return {
            due : "DUE ON : "+this.card.deadline.slice(0,17),
            last_modified : "last modified : "+this.card.timestamp.slice(5,17),
            showModal_update : false,
            showModal_delete : false,
            showModal_completed : false,
            completed : this.card.status,
            all_threads_card :[],
            change_thread_id : 0,
            fetch_card : {},
        }
    },
    watch: {

    },
    computed : {

    },
    mounted : async function() {
        const response = await fetch('/api/card/'+this.card.id);
        if (response.ok) {
        const data = await response.json();
        this.fetch_card=data;
        console.log('Fetch Card : '+this.fetch_card.id)
        } else {
        const data = await response.json();
        alert("Card update failed :!! : " + data.error_message);
        }

        fetch('/api/allthread')
        .then((list_threads)=>list_threads.json())
        .then((data)=>{this.all_threads_card=data})
        .catch((error)=>console.log(error));

    },
    methods : {
        change_thread(id){
            this.change_thread_id = id;
            fetch("http://127.0.0.1:5000/api/transfercard/" +this.card.id,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({ 
                "thread_id": id })
                })
            .then((thread)=>thread.json())
            .then((data)=>{console.log(data)})
            .catch((error)=>{console.log(error),this.savedIconClass ="text-danger"})

        },
        c_refresh(bool){
            if(bool==true){
                this.$emit('refresh_card_list',true)
                // alert('In card card')
                fetch('/api/card/'+this.card.id)
                .then((resp)=>resp.json())
                .then((data)=>{this.fetch_card=data},console.log('refershed data'))
                .catch((error)=>console.log(error));
            }
        },
        completed_card(){

        }
    },
    filters : {
        slice: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.slice(0,17)
          }
    }
})

export default card_card