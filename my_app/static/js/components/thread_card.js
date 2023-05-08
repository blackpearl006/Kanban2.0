const thread_card = Vue.component('thread-card',{
    props : ['thread'],
    template : `
    <div class="col mb-4">
        <div class="card h-100">
            <div class="card-body">
            <h3 class="card-title">{{thread.name}}</h3>
                <div class="card-label">
                    <p>{{thread.description}}</p>
                </div>
                <div class="card-data">
                    <div class="circle"><slot></slot></div>
                </div>
                <div class="card-buttons btn-group btn-group-justified">
                    <button id="show-modal" @click="showModal_update = true" type="button" class="btn btn-outline-info">Update</button>
                    <modal-thread-update v-show="showModal_update" @close="showModal_update = false;" :thread="thread" v-on:refresh_page="refresh">
                        <h3 slot="header">{{thread.name}}</h3>
                    </modal-thread-update>
                    <button id="show-modal" @click="showModal_delete = true" type="button" class="btn btn-outline-danger">Delete</button>
                    <modal-thread-delete v-show="showModal_delete" @close="showModal_delete = false;" :thread="thread" v-on:refresh_page="refresh">
                        <h3 slot="header">{{thread.name}}</h3>
                    </modal-thread-delete>
                    
                    <router-link :to="{name : 'card' , params : {thread_id : thread.id }}" class="btn btn-outline-light" >  Card  </router-link>
                    <button @click="allcardscsv()" type="button" class="btn btn-outline-warning">Export cards</button>
                </div>
                <br>
                <br>
                <br>
                <div>
                    <dummy-card :thread_id="thread_id" class="row row-cols-1 row-cols-md-1" id="style_var"></dummy-card>
                    <new-card :thread_id="thread_id" id="style_var"></new-card>
                </div>
            </div>
            <div class="card-footer">
                <div class="progress" v-if="progress_percent>0">
                    <div class="progress-bar" role="progressbar" :style="{width: progress_percent+'%'}" aria-valuenow="34" aria-valuemin="0"
                    aria-valuemax="100">{{progress_percent}}%</div>
                </div>
                <div class="completed_tag" v-else>
                    No progress 
                </div>
            </div>
        </div>
    </div>
    `,
    data : function(){
        return {
            mounted_data : {},
            id : {},
            showModal: false,
            showModal_update : false,
            showModal_delete : false,
            thread_id : this.thread.id,
            item : 0,
            status : {},
            

        }
    },
    computed : {
        progress_percent(){
            return(this.status['completed'] / ( this.status['completed']+this.status['pending']))*100
        }
    },
    methods : {
        allcardscsv(){
            fetch("http://127.0.0.1:5000/api/allcardcsv/"+this.thread.id)
            .then( response => response)
            .then( data => {
                    const blob = new Blob([data], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.setAttribute('href', url)
                    a.setAttribute('all_csv', 'all_csv.csv');
                    a.click()
                }
                )
            .catch(error=>{console.log("error", error);
                })
        },
        refresh(bool){
            if(bool==true){
                this.$emit('refresh_page',true)
                // alert('In thread card')
            }
        }
    },
    mounted (){
        fetch("http://127.0.0.1:5000/api/cardstatus/"+this.thread.id)
        .then( response => response.json())
        .then( data => this.status=data)
        .catch(error=>{console.log("error", error)});
    }
})

export default thread_card