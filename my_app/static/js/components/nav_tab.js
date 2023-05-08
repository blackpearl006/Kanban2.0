const nav_tab = Vue.component("nav-tab",{
    template : `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">KanBan 2</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
              <router-link to="/" class="nav-link" >Dashboard</router-link>
              </li>
              <li class="nav-item">
              <!--<router-link :to="{name : 'student' , params : {studentId : 3}}" class="nav-link" replace>Profile</router-link>-->
              <router-link to="/profile" class="nav-link" >Profile</router-link>
              </li>
              <li class="nav-item">
              <router-link to="/summary" class="nav-link">Summary</router-link>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto" v-if="!logged_in">
                <li class="nav-item">
                <router-link to="/login" class="nav-link">Login</router-link>
                </li>
                <li class="nav-item">
                <router-link to="/register" class="nav-link">Register</router-link>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto" v-else>
                <li class="nav-item">
                <a class="nav-link" @click="logout()">Logout</a>
                </li>
            </ul>
          </div>
        </div>
    </nav>
    `,
    data : function(){
        return{

        }
    },
    methods : {
        async logout() {
            let logged_in = sessionStorage.getItem('Logged IN')
            if (logged_in=='True'){
                sessionStorage.setItem('Logged IN','False');
                localStorage.removeItem("access_token")
                localStorage.removeItem("current_user")
                fetch("http://127.0.0.1:5000/api/login")
                .then( response => response.json())
                .then( data => {})
                alert('Logged out from here')
                this.$router.push('/login')
            } else {
                alert('Already logged out')
            }
        }
    },
    computed : {
        logged_in(){
            if (sessionStorage.getItem('Logged IN')=='True'){return true}
            else {return false}
        }
    }
})

export default nav_tab