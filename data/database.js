/**
 * Classe para simulação de ações CRUD em ambiente local
 * @param {String} table Nome da tabela
 */
class Tables {
    constructor() {
        //-- Table
        this.table = '';

        //-- Save the increment like last key in table object
        this.increment = Object.keys(this.getData()).length;
    }

    /**
     * Set list
     * @returns void
     */
    setList() {
        //-- Save the current data
        this[this.table] = this.getData();
    }

    /**
     * Acessa o json de itens para capturar os dados
     * @param {String} id ID do item
     * @return {Object} Retorna um objeto com os dados dos itens
     */
    getData(id = null) {
        const data = localStorage.getItem(this.table);

        try {
            if (!data) {
                return {};
            }
            if (id === null) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error("An error occurred while getting the data:", error);
            throw error;
        }

        const patient = JSON.parse(data)[id];
        return patient || {};
    }

    /**
     * Valida se existe algum elemento com o mesmo valor no campo informado
     * @param {String} field Nome do campo
     * @param {String} value Valor do campo
     * @return {boolean} Retorna `true` se existir e `false` se não existir
     */
    exists(value, field) {
        const data = this.getData();
        let exists = false;

        try {
            Object.keys(data).forEach(key => {
                if (data[key][field] == value) {
                    exists = true;
                }
            });
        } catch (error) {
            console.error("An error occurred while checking if the value exists:", error);
            throw error;
        }

        this.setList();
        return exists;
    }

    /**
     * Adiciona um novo item
     * @param {Object} row Objeto com os dados do item
     */
    addRow(row) {
        let data = this.getData();

        try {
            if (data.length == 0) {
                alert("Preencha todos os campos!");
                return false;
            }

            data[this.increment] = row;
            this.increment++;
            localStorage.setItem(this.table, JSON.stringify(data));
        } catch (error) {
            console.error("An error occurred while adding the row:", error);
            throw error;
        }

        this.setList();
        return true;
    }

    /**
     * Remove um id
     * @param {String} id ID do item
     */
    removeRow(id) {
        let data = this.getData();

        try {
            delete data[id];
            localStorage.setItem(this.table, JSON.stringify(data));
        } catch (error) {
            console.error("An error occurred while removing the row:", error);
            throw error;
        }

        this.setList();
        return true;
    }

    /**
     * Remove uma lista de ids
     * @param {Array<int>} ids Lista de IDs
     */
    removeRows(ids) {
        let data = this.getData();

        try {
            ids.forEach(id => {
                delete data[id];
            });
            localStorage.setItem(this.table, JSON.stringify(data));
        } catch (error) {
            console.error("An error occurred while removing the rows:", error);
            throw error;
        }

        this.setList();
        return true;
    }

    /**
     * Atualiza os dados de um item
     * @param {String} id ID do item
     * @param {Object} data Objeto com os dados do item
     */
    updateRow(id, data) {
        const patients = this.getData();

        try {
            patients[id] = data;
            localStorage.setItem(this.table, JSON.stringify(patients));
        } catch (error) {
            console.error("An error occurred while updating the row:", error);
            throw error;
        }

        this.setList();
        return true;
    }
}


/**
 * Classe referência para simulação de tabela `patients`
 * @param {Object} patients Objeto com os dados padrão dos pacientes
 */
class Patients extends Tables {
    constructor() {
        super();

        this.table = 'patients';

        //-- Save the increment like last key in patient object
        this.increment = Object.keys(this.getData()).length;

        //-- Create a default localStorage to patients
        if (this.increment === 0) {
            let patients = [
                {
                    "name": "John Doe",
                    "birthday": "1980-01-01",
                    "cpf": "11122255523",
                },
                {
                    "name": "Jane Doe",
                    "birthday": "1985-02-02",
                    "cpf": "11122255567",
                },
                {
                    "name": "Jim Doe",
                    "birthday": "1990-03-03",
                    "cpf": "11122255510",
                },
                {
                    "name": "Jackie Doe",
                    "birthday": "1982-04-04",
                    "cpf": "11122255511",
                },
                {
                    "name": "Jordan Smith",
                    "birthday": "1988-05-05",
                    "cpf": "11122255531",
                },
                {
                    "name": "Jennifer Williams",
                    "birthday": "1995-06-06",
                    "cpf": "11122255551",
                },
                {
                    "name": "Michael Johnson",
                    "birthday": "1983-07-07",
                    "cpf": "11122255571",
                },
                {
                    "name": "Megan Brown",
                    "birthday": "1992-08-08",
                    "cpf": "11122255592",
                },
                {
                    "name": "Matthew Taylor",
                    "birthday": "1986-09-09",
                    "cpf": "11122255512",
                },
                {
                    "name": "Melissa Davis",
                    "birthday": "1991-10-10",
                    "cpf": "11122255532",
                },
                {
                    "name": "Maxwell Miller",
                    "birthday": "1984-11-11",
                    "cpf": "11122255552",
                },
                {
                    "name": "Michelle Anderson",
                    "birthday": "1993-12-12",
                    "cpf": "11122255572",
                },
                {
                    "name": "Mark Thomas",
                    "birthday": "1981-01-13",
                    "cpf": "11122255593",
                },
                {
                    "name": "Maria Garcia",
                    "birthday": "1994-02-14",
                    "cpf": "11122255513",
                },
                {
                    "name": "Martin Rodriguez",
                    "birthday": "1987-03-15",
                    "cpf": "11122255533",
                },
            ];

            //-- Adiciona os pacientes definidos por padrão
            patients.forEach(patient => {
                this.addRow(patient);
            });
        }

        this.setList();
    }

    /**
     * Acessa o json de um item em específico a partir do CPF do paciente
     * @param {string} cpf CPF do paciente
     * @return {Object} Retorna um objeto com os dados do item
     */
    getRowByCPF(cpf) {
        const patients = this.getData();
        let patient = {};
        Object.keys(patients).forEach(key => {
            if (patients[key].cpf == cpf) {
                patient = patients[key];
                patient.id = key;
            }
        });
        return patient;
    }
}

/**
 * Classe referência para simulação de tabela `priority_list` para armazenar a lista de prioridades
 * @param {Object} priority_list Objeto com os dados padrão da lista de prioridades
 */
class PriorityList extends Tables {
    constructor() {
        super();

        this.table = 'priority_list';

        //-- Save the increment like last key in patient object
        this.increment = Object.keys(this.getData()).length;

        //-- Create a default localStorage to patients
        if (this.increment === 0) {
            /**
             * Lista de prioridades
             * @type {Object} priority_list
             * @property {String} priority_list[].patient_id ID do paciente
             * @property {String} priority_list[].priority Prioridade do paciente [1, 2, 3]
             *   - `priority` = 1: Prioridade Alta;
             *   - `priority` = 2: Prioridade Média;
             *   - `priority` = 3: Prioridade Baixa;
             * 
             * @property {String} priority_list[].date `data`: Data de Entrada na Lista de Prioridades
             * @property {String} priority_list[].health `input`: Condição de Saúde
             * @property {String} priority_list[].family `input`: Histórico Familiar
             * @property {String} priority_list[].symptoms `input`: Sintomas Apresentados
             * @property {String} priority_list[].deterioration `input`: Taxa de Deterioração
             * @property {String} priority_list[].socioeconomic `input`: Situação Socioeconômica
             * @property {String} priority_list[].accessToCare `input`: Acesso a Cuidados de Saúde
             */
            let priority_list = [
                {
                    "patient_id": "0",
                    "priority": "1",
                    "date": "2023-11-26 20:30:07",
                    "health": "2",
                    "family": "3",
                    "symptoms": "1",
                    "deterioration": "1",
                    "socioeconomic": "2",
                    "accessToCare": "3",
                },
                {
                    "patient_id": "1",
                    "priority": "2",
                    "date": "2023-11-26 20:30:07",
                    "health": "3",
                    "family": "2",
                    "symptoms": "1",
                    "deterioration": "1",
                    "socioeconomic": "2",
                    "accessToCare": "3",
                },
                {
                    "patient_id": "2",
                    "priority": "3",
                    "date": "2023-11-26 20:30:07",
                    "health": "1",
                    "family": "2",
                    "symptoms": "3",
                    "deterioration": "1",
                    "socioeconomic": "2",
                    "accessToCare": "3",
                },
                {
                    "patient_id": "3",
                    "priority": "1",
                    "date": "2023-11-26 20:30:07",
                    "health": "2",
                    "family": "3",
                    "symptoms": "1",
                    "deterioration": "1",
                    "socioeconomic": "2",
                    "accessToCare": "3",
                },
                {
                    "patient_id": "4",
                    "priority": "2",
                    "date": "2023-11-26 20:30:07",
                    "health": "3",
                    "family": "2",
                    "symptoms": "1",
                    "deterioration": "1",
                    "socioeconomic": "2",
                    "accessToCare": "3",
                },
            ];

            //-- Adiciona os pacientes definidos por padrão
            priority_list.forEach(patient => {
                this.addRow(patient);
            });
        }
        
        this.setList();
    }
}