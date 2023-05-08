const numItemsToGenerate = 1;
  

function renderItem(){
    fetch(`https://source.unsplash.com/1600x900/?beach`).then((response) => {   
        let item = document.getElementByID('random_photos');
        item.existing = `<img class="beach-image" src="${response.url}" alt="beach image"/>`  ;
    }) 
  }

for(let i=0;i<numItemsToGenerate;i++){
    renderItem();
}

function myFunc(token) {
    sessionStorage.setItem('token',token)
}