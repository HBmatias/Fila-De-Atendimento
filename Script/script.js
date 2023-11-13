function gerar(){
    let nomes = ["Diego", "Gabriel", "Lucas"];
    let lista = document.getElementById('lista');
    for(var i = 0; i < nomes.length; i++){
        let item = document.createElement('li');
        item.appendChild(document.createTextNode(nomes[i]));
        lista.appendChild(item);
    }
}