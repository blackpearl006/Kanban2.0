const dummy_thread = Vue.component('dummy-thread',{
    props : ["thread","index"],
    template : `
    <div>
    <thread-card :thread="thread">{{index}}</thread-card>
    </div>`,
    data : function(){
        return {
        }
    }
})

export default dummy_thread