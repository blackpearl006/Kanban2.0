const thread_chart = Vue.component('thread-chart',{
    props : ['thread'],
    template: `
    <div style="width: 600px;">
        <h3>{{thread.name}}</h3>
        <canvas :id="id"></canvas>
    </div>`,
    data : function(){
        return{
            current_user : {},
            all_data : [],
            id : this.thread.name,
            card_status : [],
            card_deadline : [],
        }
    },
    computed : {
        total_threads : function(){
            return this.all_data.length
        },
    },
    async mounted(){
        const rawCurrentUser = await fetch("http://127.0.0.1:5000/api/current_user")
        if (rawCurrentUser.ok){
            const current_user = await rawCurrentUser.json()
            this.current_user = current_user
        }
        else{
            alert('Could not fetch current user !! LOGIN...!!')
        };

        fetch('/api/summarythread/'+this.thread.id)
        .then((response)=>response.json())
        .then((data)=>{this.all_data=data,
            console.log(this.all_data)
            this.card_status=data['card_status'],
            this.card_deadline=data['card_deadline']
            new Chart(document.getElementById(this.id), {
                type: 'bar',
                data: {
                labels: data['card_deadline'],
                datasets: [{
                    label: '# of Votes',
                    data: data['card_status'],
                    borderWidth: 1
                }]
                },
                options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                }
                }
            });
        })
        .catch((error)=>console.log(error));
         
    }
})

export default thread_chart