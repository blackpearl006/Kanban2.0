const all_cards_in_one = Vue.component('all-card',{
    props : ['thread'],
    template : `
    <div>
        <div class="row row-cols-1 row-cols-md-1" id="style_var">
            <div v-for="(card,index) in all_cards" v-if="all_cards.length>0">
                <div class="col mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                        <h5 class="card-title" v-if="false">COMPLETED</h5>
                        <h5 class="card-title" v-else>{{card.deadline.slice(0,17)}}</h5>
                            <div class="card-label">
                                <p>Label : {{card.label}}</p>
                            </div>
                            <div class="thread_circle">{{index+1}}</div>
                            <div class="card-data">
                                {{card.data}}
                                <br>
                                <br>
                            </div>
                            <div class="card-buttons btn-group btn-group-justified">
                                <button id="show-modal" @click="showModal_update = true" type="button" class="btn btn-outline-info">Update</button>
                                <div v-if="showModal_update">
                                    <transition name="modal">
                                        <div class="modal-mask">
                                        <div class="modal-wrapper">
                                            <div class="modal-container">
                                
                                            <div class="modal-header">
                                                <h3>Update Card</h3>
                                                Card data : {{card.data}}
                                            </div>
                                
                                            <div class="modal-body">
                                                <slot name="body">
                                                Updated data : <input type="text" v-model="upd_card_data"/>
                                                <br>
                                                Updated label : <input type="text" v-model="upd_card_label"/>
                                                <br>
                                                Updated Deadline : <input type="date" v-model="upd_card_deadline"/>
                                                </slot>
                                            </div>
                
                                            <div class="modal-footer">
                                                <slot name="footer">
                                                <!--default footer-->
                                                <button class="modal-default-button" @click="showModal_update = false;">
                                                    Cancel 
                                                </button>
                                                <button class="modal-default-button" @click="showModal_update = false; update_card(card); ">
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
                                            {{thread.name}}'s card
                                            </div>
                                
                                            <div class="modal-body">
                                                <slot name="body">
                                                    Are you sure you want to delete this thread along all its cards ?
                                                    Data : {{card.data}}
                                                </slot>
                                            </div>
                                
                                            <div class="modal-footer">
                                                <slot name="footer">
                                                <!--default footer-->
                                                <button class="modal-default-button" @click="showModal_delete = false">
                                                    Cancel 
                                                </button>
                                                <button class="modal-default-button" @click="showModal_delete = false; delete_card({card}); ">
                                                    Submit 
                                                </button>
                                                </slot>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </transition>
                                </div>

                            </div>
                            <br>
                        </div>
                        <div class="card-footer">
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <new-card :thread_id=thread.id  id="style_var"></new-card>
    </div>
    `,
    data : function(){
        return{
            all_cards : [],
            showModal_update : false,
            showModal_delete : false,
            showModal_completed : false,
            all_threads :[],
            change_thread_id : 0,
            upd_card_data : "",
            upd_card_label : "",
            upd_card_deadline : 0,
        }
    },
    mounted : async function() {
        await fetch('/api/allcard/'+this.thread.id)
        .then((list_cards)=>list_cards.json())
        .then((data)=>{this.all_cards=data})
        .catch((error)=>console.log(error))

        // fetch('api/thread/'+this.thread_id)
        // .then(response=>response.json())
        // .then(data=>{this.thread_name=data})
        // .catch((error)=>console.log(error))
    },
    methods : {
        update_card : async function(card){
            const data = {
              data : this.upd_card_data,
              label : this.upd_card_label ,
              deadline : this.upd_card_deadline,
            }
            const response = await fetch(
              "http://127.0.0.1:5000/api/card/"+card.id,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(data)
              } 
            );
            if (response.ok) {
                const data = await response.json();
                // this.$router.push('/') redundant navigation
                // this.$emit('update')
                fetch('/api/allcard/'+this.thread.id)
                .then((list_cards)=>list_cards.json())
                .then((data)=>{this.all_cards=data})
                .catch((error)=>console.log(error))
                this.check_flag=true
            } else {
              const data = await response.json();
              alert("Theard addition failed :!! : " + data.error_message);
            }
            if (this.check_flag){
              this.$emit('update')
            }
          },
          delete_card : function(card){
            fetch("http://127.0.0.1:5000/api/card/" + card.id,{
                method : 'DELETE',
            })
            .then((response)=>response.json())
            .then((data)=>{this.message=data})
            .catch((error)=>{})

            fetch('/api/allcard/'+this.thread.id)
                .then((list_cards)=>list_cards.json())
                .then((data)=>{this.all_cards=data})
                .catch((error)=>console.log(error))
        }
    },
    computed : {
        // last_modified(card){
        //     return "last modified : "+ card.timestamp.slice(5,17)
        // },
        // due(card){
        //     return "DUE ON : "+ card.deadline.slice(0,17)
        // },
        // completed(card){
        //     return card.status
        // }
    }
})
export default all_cards_in_one


{/* <div class="card-footer">
<div class="completed_tag" v-if="!completed(card)"> {{last_modified(card)}} </div>
<div class="completed_tag" v-else> COMPLETED TASK </div>
</div> */}


// <modal-completed v-if="showModal_completed" @close="showModal_completed = false;" :card="card">
// <h3 slot="header">Completed task </h3>
// </modal-completed>