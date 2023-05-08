const router_card = {
    props:['thread_id'],
    template : `
    <div>
        <div class="row row-cols-1 row-cols-md-3">
            <div v-if="all_cards.length>0" v-for="(card,index) in all_cards" :key="index+1">
                <card-card :card="card">{{index+1}}</card-card>
            </div>
        </div>
    <new-card :thread_id="thread_id" id="style_var"></new-card>
    </div>
    `,
    data : function(){
        return {
            all_cards :[],
        }
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
    methods : {

    }
}
export default router_card