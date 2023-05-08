const modal_card_update = Vue.component("modal-card-update", {
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
                  <button class="modal-default-button" @click="$emit('close')">
                    Cancel 
                  </button>
                  <button class="modal-default-button" @click="$emit('close'); update_card();">
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
            upd_card_data : "",
            upd_card_label : "",
            upd_card_deadline : "",
            savedIconClass : "text-success",
        }
    },
    delimiters :['${','}'],
    methods : {
        update_card : async function(){
          const data = {
            data : this.upd_card_data,
            label : this.upd_card_label ,
            deadline : this.upd_card_deadline,
          }
          const response = await fetch(
            "http://127.0.0.1:5000/api/card/"+this.card.id,{
              method : 'PUT',
              headers : {
                  'Content-Type' : 'application/json',
              },
              body : JSON.stringify(data)
            } 
          );
          if (response.ok) {
            const data = await response.json();
            this.$emit('card_refresh',true)
          } else {
            const data = await response.json();
            alert("Card update failed :!! : " + data.error_message);
          }
        }
    },
    watch : {

    }
});

export default modal_card_update