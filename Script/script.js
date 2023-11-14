document.getElementById("myFormData").addEventListener("submit", function(event){
    event.preventDefault()
    
    var dob = new Date(document.getElementById("dob").value);
    var today = new Date();
    
    if(dob.getTime() > today.getTime()){
      alert("A data de nascimento não pode ser no futuro!");
      return false;
    }
    
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    let agePonderosity = 0;

    if(age < 18){
      agePonderosity = 1;
      alert("baixa prioridade");
    } else if (age > 60) {
        agePonderosity = 3;
        alert("Alta prioridade")
    }else {
        agePonderosity = 2;
        alert("Media prioridade")
    }
    
})
function gerar(){
    let nomes = ["Diego", "Gabriel", "Lucas"];
    let lista = document.getElementById('lista');
    for(var i = 0; i < nomes.length; i++){
        let item = document.createElement('li');
        item.appendChild(document.createTextNode(nomes[i]));
        lista.appendChild(item);
    }
}
