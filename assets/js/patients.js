$(function () {
    $("#cadPatients").on("submit", cadPatients);

    console.log(JSON.parse(localStorage.getItem('patients')));
});

function cadPatients() {
    let patient = {
        name: document.getElementById('name').value,
        birthday: document.getElementById('birthday').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ""),
    };

    if (patient.nome == "" || patient.birth == "" || patient.cpf == "") {
        alert("Preencha todos os campos!");
        return false;
    }

    //-- Validar se o paciente ja existe
    if (window.patients.exists(patient.cpf)) {
        alert("Paciente já cadastrado!");
        return false;
    }

    // E então salvar os dados novamente
    if (window.patients.addRow(patient))
        alert("Paciente cadastrado com sucesso!");
}