const modal_thread_update = Vue.component("modal-thread-update", {
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
                Updated name : <input type="text" v-model="upd_thread_name"/>
                <br>
                Updated Description : <input type="text" v-model="upd_thread_desc"/>
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <!--default footer-->
                  <button class="modal-default-button" @click="$emit('close')">
                    Cancel 
                  </button>
                  <button class="modal-default-button" @click="$emit('close'); update_thread(); ">
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
            upd_thread_name : "",
            upd_thread_desc : "",
            savedIconClass : "text-success",
        }
    },
    delimiters :['${','}'],
    methods : {
        update_thread : async function(){
          const data = {
            name : this.upd_thread_name,
            description : this.upd_thread_desc ,
          }
          const response = await fetch(
            "http://127.0.0.1:5000/api/thread/"+this.thread.name,{
              method : 'PUT',
              headers : {
                  'Content-Type' : 'application/json',
              },
              body : JSON.stringify(data)
            } 
          );
          if (response.ok) {
            const data = await response.json();
            this.$emit('refresh_page',true)
          } else {
            const data = await response.json();
            alert("Card update failed :!! : " + data.error_message);
          }
        }
    }
});

export default modal_thread_update