$(function () {
    $("#myFormData").on("submit", function (event) {
        event.preventDefault()

        var dob = new Date(document.getElementById("dob").value);
        var today = new Date();

        if (dob.getTime() > today.getTime()) {
            alert("A data de nascimento não pode ser no futuro!");
            return false;
        }

        var age = today.getFullYear() - dob.getFullYear();
        var m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        let agePonderosity = 0;

        if (age < 18) {
            agePonderosity = 1;
            alert("baixa prioridade");
        } else if (age => 0 || age <= 12) {
            alert("Alta prioridade")
        } else if (age > 60) {
            agePonderosity = 3;
            alert("Alta prioridade")
        } else {
            agePonderosity = 2;
            alert("Media prioridade")
        }

    })

    window.patients = new Patient();
    $("#cadPatients").on("submit", cadPatients);
});

function gerar() {
    let nomes = ["Diego", "Gabriel", "Lucas"];
    let lista = document.getElementById('lista');
    for (var i = 0; i < nomes.length; i++) {
        let item = document.createElement('li');
        item.appendChild(document.createTextNode(nomes[i]));
        lista.appendChild(item);
    }
}

function cadPatients() {
    let patient = {
        name: document.getElementById('name').value,
        birthday: document.getElementById('birthday').value,
        cpf: document.getElementById('cpf').value,
    };

    if (patient.nome == "" || patient.birth == "" || patient.cpf == "") {
        alert("Preencha todos os campos!");
        return false;
    }

    // E então salvar os dados novamente
    if (window.patients.addPatient(patient))
        alert("Paciente cadastrado com sucesso!");
}
