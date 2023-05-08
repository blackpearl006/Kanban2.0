const modal_card_delete = Vue.component("modal-card-delete",{
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
                    Name : {{card.name}}
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <!--default footer-->
                  <button class="modal-default-button" @click="$emit('close')">
                    Cancel 
                  </button>
                  <button class="modal-default-button" @click="$emit('close'); delete_card(); ">
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
    methods : {
        // delete_card : function(){
        //     fetch("http://127.0.0.1:5000/api/card/" +this.card.id,{
        //         method : 'DELETE',
        //     })
        //     .then((response)=>response.json())
        //     .then((data)=>{this.message=data,this.$emit('refresh_page',true)})
        //     .catch((error)=>{console.log(error),this.savedIconClass ="text-danger"})
        // },
        delete_card : async function(){
          const data = {
            data : this.upd_card_data,
            label : this.upd_card_label ,
            deadline : this.upd_card_deadline,
          }
          const response = await fetch(
            "http://127.0.0.1:5000/api/card/" +this.card.id,{
              method : 'DELETE',
            } 
          );
          if (response.ok) {
            const data = await response.json();
            this.$emit('card_refresh',true)
          } else {
            const data = await response.json();
            alert("Card deletion failed :!! : " + data.error_message);
          }
        }
    },
})

export default modal_card_delete