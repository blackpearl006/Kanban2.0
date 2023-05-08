const modal_thread_delete = Vue.component("modal-thread-delete",{
    template: `
    <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  Something Else 
                </slot>
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
                  <button class="modal-default-button" @click="$emit('close')">
                    Cancel 
                  </button>
                  <button class="modal-default-button" @click="$emit('close'); delete_thread(); ">
                    Submit 
                  </button>
                  <i class="bi bi-cloud-arrow-up-fill" v-bind:class="savedIconClass"></i>
                </slot>
              </div>
            </div>
          </div>
        </div>
    </transition>
    `,
    props :['thread'],
    data : function(){
        return {
            savedIconClass : "text-success",
            message : "",
            card_count : 0,
        }
    },
    methods : {
        delete_thread : function(){
            fetch("http://127.0.0.1:5000/api/thread/" +this.thread.name,{
                method : 'DELETE',
                
            })
            .then((response)=>response.json())
            .then((data)=>{this.message=data,this.$emit('refresh_page',true)})
            .catch((error)=>{console.log(error),this.savedIconClass ="text-danger"})
        }
    },
    computed : {
        count_card : function(){
            fetch("http://127.0.0.1:5000/api/allcard/"+this.thread.id)
        }
    }
})

export default modal_thread_delete