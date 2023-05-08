const new_card = Vue.component("new-card",{
    props:["thread_id"],
    delimiters :['${','}'],
    template :`
    <div class="col mb-4">
      <div class="card h-100">
        <div class="card-body">
          <router-link :to="{name : 'addcard' , params : {thread_id : thread_id }}" class="d-grid gap-2 btn btn-primary active" >Add Card</router-link>
        </div>
      </div>
    </div>
    `,
    data : function(){
        return {
            url : "/"+this.thread_id+"/add_card"
        }
    }
})

export default new_card