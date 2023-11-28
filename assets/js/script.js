$(function () {
    window.patients = new Patients();
    window.priority = new PriorityList();
    console.log(window.patients, window.priority);

    //-- Adiciona máscara no cpf
    $('#cpf').mask('000.000.000-00', { reverse: true });

    $(".listAccess").on("click", function (event) {
        let
            /**
             * Contexto do formulário
             * @type {jQuery} form
             */
            form = $("#listAccess"),

            /**
             * Dados do formulário
             * @type {Object} data
             * @property {String} data.cpf CPF do paciente
             * @property {String} data.date Data de entrada na lista de prioridades
             * @property {String} data.comorbidity Comorbidades
             * @property {String} data.health Condição de saúde
             * @property {String} data.family Histórico familiar
             * @property {String} data.symptoms Sintomas apresentados
             * @property {String} data.socioeconomic Situação socioeconômica
             * @property {String} data.accessToCare Acesso a cuidados de saúde
             */
            data = getFormData(form);

        //-- Valida os dados do cpf
        if (data.cpf.length !== 11 || data.cpf == "" || typeof data.cpf == "undefined") {
            alert("CPF inválido!");
            return false;
        }

        //-- Captura os dados do paciente
        const patient = window.patients.getRowByCPF(data.cpf);
        if (typeof patient.name === "undefined") {
            alert("Paciente não encontrado!");
            return false;
        }

        //-- Valida se o paciente ja esta na fila
        if (window.priority.exists(patient.id, "patient_id") === true) {
            alert("Paciente já está na fila de prioridades!");
            return false;
        }

        /**
         * Aciona as regras de cálculo
         * @type {PriorityRules} priority
         */
        const priority = new PriorityRules(patient, data);

        //-- Adiciona o paciente na fila de prioridades
        window.priority.addRow({
            patient_id: patient.id,
            priority: priority.priority,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '), // YYYY-MM-DD HH:MM:SS
            health: priority.health,
            family: priority.history,
            symptoms: priority.symptoms,
            socioeconomic: data.socioeconomic,
            accessToCare: data.accessToCare,
        });

        alert(`O paciente ${patient.name} foi inserido na Fila de Atendimento!`);
    })

    $("button.gerar").on("click", gerar);
});

/**
 * Retorna os dados de entrada de um elemento jQuery com inputs, selects e textareas
 * @param {jQuery} form Elemento jQuery
 * @return {Object} Dados do formulário
 */
function getFormData(form) {
    let data = {};
    form.find("input, select, textarea").each(function (index, element) {
        let input = $(element),
            value = input.val() || null;

        //-- Valida se valores obrigatórios estão nulos
        if (
            typeof input.attr('required') !== 'undefined'
            && (
                value == ""
                || typeof value == "undefined"
                || value == null
            )
        ) {
            let label = form.find(`label[for="${input.attr('id')}"]`).text(),
                err = `O campo "${label.replace(/:/g, '')}" é obrigatório!`;

            alert(err);
            throw new Error(err);
        }

        //-- Valida quando campo for cpf
        if (input.attr("name") == "cpf") {
            value = value.replace(/\D/g, "");
        }

        data[input.attr("name")] = value;
    });

    return data;
}

/**
 * Retorna a idade do paciente
 * @param {Date} birth Data de nascimento do paciente
 * @return {int} Idade do paciente
 */
function getAge(birth) {
    let today = new Date(),
        age = today.getFullYear() - birth.getFullYear(),
        m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

function gerar() {
    let $obj = $(this),
        ctx = $obj.parent().find(".lista"),
        list = window.priority.getData();
    for (let i in list) {
        let item = $("<p>"),
            lista = list[i],
            patient = window.patients.getData(lista.patient_id);

        if (lista.priority == $obj.data('priority')) {
            item.html(patient.name);
            ctx.append(item);
        }
    }
}

/**
 * Regras de cálculo para entrada na fila de prioridades
 * @param {object} patient Objeto com os dados do paciente
 * @param {object} data Informações de Triagem do paciente
 */
function PriorityRules(patient, data) {
    /**
     * Referência da classe
     * @param {PriorityRules} pr
     */
    const pr = this;

    /**
     * Data de nascimento do paciente
     * @type {Date} birth
     */
    pr.birth = new Date(patient.birthday);

    /**
     * Idade do paciente
     * @type {int} age
     */
    pr.age = getAge(pr.birth);

    /**
     * Método de inicialização da classe
     */
    pr.init = function () {
        /**
         * Regra de idade do paciente
         * @type {int} birthRule
         */
        pr.birthRule = pr.getBirthRule();

        /**
         * Regra de condição de saúde do paciente
         * @type {int} healthRule
         */
        pr.healthRule = pr.getHealthRule();

        /**
         * Regra de histórico familiar do paciente
         * @type {int} history
         */
        pr.history = pr.getHistory();

        /**
         * Sintomas apresentados pelo paciente
         * @type {int} symptoms
         */
        pr.symptoms = toInt(pr.symptoms);

        /**
         * Calcula a média ponderada para definir a prioridade do paciente
         * @type {float} media
         */
        pr.media = ((pr.birthRule * 2) + (pr.healthRule * 5) + (pr.history * 3) + (pr.symptoms * 4)) / 4;

        //-- Regra 1: Prioridade Alta
        if (pr.media >= 5) {
            pr.priority = 1;
        }

        //-- Regra 2: Prioridade Média
        if (pr.media >= 3 && pr.media < 5) {
            pr.priority = 2;
        }

        //-- Regra 3: Prioridade Baixa
        if (pr.media < 3) {
            pr.priority = 3;
        }
    }

    /**
     * Método de cálculo de idade do paciente
     * @returns {int} Lógica de idade do paciente
     *   - `[1]` = Idade entre **3** e **59** anos **sem comorbidades**;
     *   - `[2]` = Idade entre **3** e **59** anos **com comorbidades**;
     *   - `[3]` = Idade entre **0** e **2** anos e **60** a ?? anos **sem comorbidades**;
     *   - `[4]` = Idade entre **0** e **2** anos e **60** a ?? anos **com comorbidades**;
     */
    pr.getBirthRule = function () {
        //-- Regra 1: Idade maior ou igual a 60 anos || Idade menor ou igual a 2 anos
        if (pr.age >= 60 || pr.age <= 2) {
            //-- Regra 1.1: Possui comorbidades
            if (pr.age < 60 && !data.comorbidity == "N") {
                return 4;
            }
            return 3;
        }

        //-- Regra 2: Idade menor que 60 anos e possui comorbidades
        if (pr.age < 60 && data.comorbidity == "S") {
            return 2;
        }

        //-- Regra 4: Aqueles excedentes a regra
        return 1;
    }

    /**
     * Método de cálculo de condição de saúde do paciente
     * @returns {int} Lógica de condição de saúde do paciente
     *   - `[1]` = Condição de saúde **boa**;
     *   - `[2]` = Condição de saúde **regular**;
     *   - `[3]` = Condição de saúde **ruim**;
     */
    pr.getHealthRule = function () {
        let
            //-- Captura o peso do campo de condições de saúde
            weight = $('[id="health"]').data("weight"),

            //-- Calcula o valor da condição de saúde
            health = (toInt(data.health) * toInt(weight)) / 100;

        //-- Regra 1: Condição de saúde ruim
        if (health >= 1) {
            return 3;
        }

        //-- Regra 2: Condição de saúde regular
        if (health >= 0.5) {
            return 2;
        }

        //-- Regra 3: Condição de saúde boa
        return 1;
    }

    /**
     * Método para cálculo de histórico familiar do paciente
     *   - Cálculos de `Situação Socioeconômica` e `Acesso a Cuidados de Saúde` como agravantes do histórico familiar
     * @returns {int} Lógica de histórico familiar do paciente
     *   - `[1]` = Histórico familiar **boa**;
     *   - `[2]` = Histórico familiar **regular**;
     *   - `[3]` = Histórico familiar **ruim**;
     */
    pr.getHistory = function () {
        let
            //-- Captura o peso do campo de histórico familiar
            weight = $('[id="family"]').data("weight"),

            //-- Calcula o valor da histórico familiar
            family = (toInt(data.family) * toInt(weight));

        //-- Se existir índice de situação socioeconômica
        if (data.socioeconomic !== null) {
            family = (family * toInt(data.socioeconomic));
        }

        //-- Se existir índice de acesso a cuidados médicos
        if (data.accessToCare !== null) {
            family = (family * toInt(data.accessToCare));
        }

        //-- Finaliza o cálculo de histórico familiar
        family = family / 100;

        //-- Regra 1: Histórico familiar ruim
        if (family >= 1) {
            return 3;
        }

        //-- Regra 2: Histórico familiar regular
        if (family >= 0.5) {
            return 2;
        }

        //-- Regra 3: Histórico familiar boa
        return 1;
    }

    /**
     * Inicialização da classe
     */
    pr.init();
}

/**
 * Converte um número para inteiro
 * @param {*} number Valor a ser convertido
 * @returns {int}
 */
function toInt(number) {
    return parseInt(toDecimal("0" + number, 0));
}

/**
 * Converte um numero para String decimal
 * @param {*} number Valor a ser convertido
 * @param {*} decimais Quantidade de números após a vírgula
 * @returns {string}
 */
function toDecimal(number, decimais) {
    if (decimais > 0) {
        return toFloat(number)
            .toFixed(decimais || 2)
            .replace(".", ",");
    } else {
        return parseInt(toFloat(number).toFixed(0)) + "";
    }
}

/**
 * Converte um número para float
 * @param {*} number Valor a ser convertido
 * @returns {float}
 */
function toFloat(number) {
    number = ("0" + number).match(/(\d|,|\.)/g).join("");
    if (number.indexOf(",") >= 0) {
        return parseFloat((number + "").replace(/\./g, "").replace(",", "."));
    } else {
        return parseFloat(number);
    }
}