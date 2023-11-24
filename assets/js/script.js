$(function () {
    window.patients = new Patient();
    console.log(window.patients);

    //-- Adiciona máscara no cpf
    $('#cpf').mask('000.000.000-00', { reverse: true });

    $(".listAccess").on("click", function (event) {
        event.preventDefault()

        let form = $("#listAccess"),
            cpf = form.find("#cpf").val().replace(/\D/g, '');

        //-- Valida os dados do cpf
        if (cpf.length !== 11 || cpf == "") {
            alert("CPF inválido!");
            return false;
        }

        //-- Captura os dados do paciente
        let patient = window.patients.getRowByCPF(cpf);
        console.log(patient, patient.length === 0 || patient == {});
        if (patient.length === 0 || patient == {}) {
            alert("Paciente não encontrado!");
            return false;
        }

        var birth = new Date(patient.birthday);
        var today = new Date();

        var age = today.getFullYear() - birth.getFullYear();
        var m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
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
