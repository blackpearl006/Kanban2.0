const profile = Vue.component("profile", {
  // props : ['current_user'],
  template: `
    <div class="container mt-5">
      <div class="row d-flex justify-content-center">
        <div class="col-md-7">
          <div class="card p-3 py-4" style="background-color:lightslategray;">
            <div class="image text-center">
              <img src="https://i.postimg.cc/NMjBT3Ty/download.png" width="100" class="rounded-circle">
            </div>
            <div class="text-center mt-3">
                <div class="profile" style="color: black;">
                  Username : <p>{{ current_user.username }}</p>
                  Email : <p>{{ current_user.email}} </p>
                </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="all_thread_csv()" :href="item">All Thread CSV</button>
      <button @click="all_csv()">All Card CSV</button>
    </div>
    `,
  data: function () {
    return {
      current_user: {},
      item : 0,
    };
  },
  methods: {
    all_thread_csv(){
      fetch("http://127.0.0.1:5000/api/allthreadcsv")
      .then( response => response)
      .then( data =>  {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', 'download.csv');
        a.click()
        })
      .catch(error=>{
      console.log("error", error);
      })
    },
    all_csv(){
      fetch("http://127.0.0.1:5000/api/allcsv")
      .then( response => response)
      .then( data => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('all_csv', 'all_csv.csv');
        a.click()
        })
      .catch(error=>{
      console.log("error", error);
      })
    }
  },
  async mounted() {
    let logged_in = sessionStorage.getItem('Logged IN')
    if (logged_in=='True'){
        const rawCurrentUser = await fetch(
          "http://127.0.0.1:5000/api/current_user"
        );
        if (rawCurrentUser.ok) {
          const current_user = await rawCurrentUser.json();
          this.current_user = current_user;
        } else {
          alert("Could not fetch current user !! LOGIN...!!");
        }
      } else {
        alert('Login to access')
        this.$router.push('/login')
      }
  }
});

export default profile;
