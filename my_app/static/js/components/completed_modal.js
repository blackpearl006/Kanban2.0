const modal_completed = Vue.component("modal-completed", {
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
                HAVE YOU COMPLETED THE TASK ??
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <!--default footer-->
                  <button class="modal-default-button" @click="$emit('close')">
                    Cancel 
                  </button>
                  <button class="modal-default-button" @click="$emit('close'); task_completed(); ">
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
    props :['card'],
    data : function(){
        return {
            savedIconClass : "text-success",
            message : "",
            
        }
    },
    delimiters :['${','}'],
    methods : {
        task_completed : async function(){
          const response = await fetch(
            "http://127.0.0.1:5000/api/completed/" +this.card.id
          );
          if (response.ok) {
            const data = await response.json();
            this.$emit('card_refresh',true)
          } else {
            const data = await response.json();
            alert("Card update failed :!! : " + data.error_message);
          }
        }
    }
});

export default modal_completed