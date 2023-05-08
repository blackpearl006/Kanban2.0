const new_thread = Vue.component("new-thread",{
    template :`
    <div class="col mb-4">
    <div class="card h-100">
      <div class="card-body">
        <router-link to="/addthread" class="d-grid gap-2 btn btn-primary active" >Add Thread</router-link>
      </div>
    </div>
  </div>
    `,
})

export default new_thread