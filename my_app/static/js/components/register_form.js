const register_form = Vue.component('register-form',{
    template :    
    `
    <div class="container">
    Username : <input type="text" class="form-control" v-model="username" required > <br>
    Email : <input type="text" class="form-control" v-model="email" required /> <br>
    Password : <input type="password" class="form-control" v-model="password" required /> <br> 
    Confirm Password : <input type="password" class="form-control" v-model="confirm_pass" required /> <br> 
    <div class="checkbox mb-3">
      <h6>Alrerady have a account</h6>
      <router-link to="/login" class="btn btn-sm btn-secondary">Login</router-link>
    </div>
    <button v-on:click.prevent="register" class='btn btn-lg btn-block btn-primary'>
        Register
    </button>
    <i class="bi bi-cloud-arrow-up-fill" v-bind:class="savedIconClass"></i> 
    </div>`
    ,
    data : function(){
        return{
            username : "",
            password : "",
            confirm_pass : "",
            email : "" ,
            savedIconClass : "text-success",
            current_user :{},
        }
    },
    methods : {
        register : async function(){
            const data = {
                username : this.username,
                password : this.password ,
                confirm_pass : this.confirm_pass,
                email : this.email
            }
            const response = await fetch(
                "http://127.0.0.1:5000/api/user",{
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
                this.savedIconClass ="text-success"
                this.$router.push('/login')
            } else {
                const data = await response.json();
                console.log(data)
                alert("Login Falied!! : " + data.error_message);
            }
        }
    },
    computed : {},
    watch : {},
})

export default register_form