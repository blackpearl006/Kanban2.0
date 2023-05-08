const login_form = Vue.component('login-form',{
    template :    
    `<div class="container">
    <img src="https://i.postimg.cc/Vkw6vH7t/logo.png" width="150"> <br>
    Username : <input type="text" class="form-control" v-model="username" required > <br>
    Password : <input type="password" class="form-control" v-model="password"  required > <br>
    <div class="checkbox mb-3">
      <h6>Do not have an account ?</h6>
      <router-link to="/register" class="btn btn-sm btn-secondary">Register</router-link>
    </div>
    <button v-on:click.prevent="login" class='btn btn-lg btn-block btn-primary'>
        Submit
    </button>
    <i class="bi bi-cloud-arrow-up-fill" v-bind:class="savedIconClass"></i> 
    </div>`
    ,
    data : function(){
        return{
            username : "",
            password : "",
            savedIconClass : "text-success",
            current_user :{},
        }
    },
    methods : { 
        async login () {
            const data = {
                username : this.username,
                password : this.password ,
            }
            const response = await fetch(
              "http://127.0.0.1:5000/api/login",{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(data)
              }
            );
            if (response.ok) {
              const data = await response.json();
              this.current_user = data;
              localStorage.setItem('current_user',JSON.stringify(this.current_user));
              localStorage.setItem('access_token',JSON.stringify(this.current_user.access_token))
              sessionStorage.setItem('Logged IN','True');
              this.savedIconClass ="text-success"
              this.$router.push('/')
            } else {
              alert("Login Falied!!");
            }
        }
    },
    computed : {},
    watch : {},
})

export default login_form
