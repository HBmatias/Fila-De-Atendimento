$(function () {
    window.patients = new Patient();
    $("#cadPatients").on("submit", cadPatients);

    console.log(JSON.parse(localStorage.getItem('patients')));
});

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
    if (window.patients.addRow(patient))
        alert("Paciente cadastrado com sucesso!");
}