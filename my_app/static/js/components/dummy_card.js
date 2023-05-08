const dummy_card = Vue.component('dummy-card',{
    props : ["thread_id"],
    template :`
    <div>
        <div v-for="(card,index) in all_cards" v-if="all_cards.length>0" :index="index" >
            <card-card :card="card">
                {{index+1}}
            </card-card>
        </div>
    </div>
    `,
    data : function(){
        return {
            all_cards :[],
        }
    },
    method :{
        
    },
    mounted : async function() {
        const response = await fetch('/api/allcard/'+this.thread_id);
        if (response.ok) {
        const data = await response.json();
        this.all_cards=data;
        } else {
        const data = await response.json();
        alert("Card update failed :!! : " + data.error_message);
        }
    },
})

export default dummy_card