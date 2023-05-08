const app_summary = Vue.component("app-summary",{
    props:[],
    template : `
    <div class="row row-cols-1 row-cols-md-2" id="style_var">
    <thread-chart v-for="thread in all_threads" :thread="thread"></thread-chart>
    </div>
    `,
    data : function(){
        return{
            all_threads: [],
            all_data : []
        }
    },
    async mounted(){

        let logged_in = sessionStorage.getItem('Logged IN')
        if (logged_in=='True'){
            const list_threads = await fetch(
              "http://127.0.0.1:5000/api/allthread"
            );
            if (list_threads.ok) {
              const data = await list_threads.json();
              this.all_threads = data;
            } else {
              alert("LOGIN...!!");
            }
          } else {
            this.$router.push('/login')
            alert('Login to access')
          }
    }
})

export default app_summary