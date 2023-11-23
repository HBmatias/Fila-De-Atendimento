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
     * Acessa o json de itens para capturar os dados
     * @param {String} id ID do item
     * @return {Object} Retorna um objeto com os dados dos itens
     */
    getData(id = null) {
        const data = localStorage.getItem(this.table);

        if (!data) {
            return {};
        }
        if (id === null) {
            return JSON.parse(data);
        }

        const patient = JSON.parse(data)[id];
        return patient || {};
    }

    /**
     * Adiciona um novo item
     * @param {Object} row Objeto com os dados do item
     */
    addRow(row) {
        let data = this.getData();

        if (data.length == 0) {
            alert("Preencha todos os campos!");
            return false;
        }

        data[this.increment] = row;
        this.increment++;
        localStorage.setItem(this.table, JSON.stringify(data));
        return true;
    }

    /**
     * Remove um id
     * @param {String} id ID do item
     */
    removeRow(id) {
        let data = this.getData();
        delete data[id];
        localStorage.setItem(this.table, JSON.stringify(data));
    }

    /**
     * Remove uma lista de ids
     * @param {Array<int>} ids Lista de IDs
     */
    removeRows(ids) {
        let data = this.getData();
        ids.forEach(id => {
            delete data[id];
        });
        localStorage.setItem(this.table, JSON.stringify(data));
    }

    /**
     * Atualiza os dados de um item
     * @param {String} id ID do item
     * @param {Object} data Objeto com os dados do item
     */
    updateRow(id, data) {
        const patients = this.getData();
        patients[id] = data;
        localStorage.setItem(this.table, JSON.stringify(patients));
    }
}


/**
 * Classe referência para simulação de tabela `patients`
 * @param {Object} patients Objeto com os dados padrão dos pacientes
 */
class Patient extends Tables {
    constructor() {
        super();

        this.table = 'patients';

        this.patients = {
            "0": {
                "name": "John Doe",
                "birthday": "1980-01-01",
                "cpf": "555-1234",
            },
            "1": {
                "name": "Jane Doe",
                "birthday": "1985-02-02",
                "cpf": "555-5678",
            },
            "2": {
                "name": "Jim Doe",
                "birthday": "1990-03-03",
                "cpf": "555-9101",
            },
            "3": {
                "name": "Jackie Doe",
                "birthday": "1982-04-04",
                "cpf": "555-1112",
            },
            "4": {
                "name": "Jordan Smith",
                "birthday": "1988-05-05",
                "cpf": "555-1314",
            },
            "5": {
                "name": "Jennifer Williams",
                "birthday": "1995-06-06",
                "cpf": "555-1516",
            },
            "6": {
                "name": "Michael Johnson",
                "birthday": "1983-07-07",
                "cpf": "555-1718",
            },
            "7": {
                "name": "Megan Brown",
                "birthday": "1992-08-08",
                "cpf": "555-1920",
            },
            "8": {
                "name": "Matthew Taylor",
                "birthday": "1986-09-09",
                "cpf": "555-2122",
            },
            "9": {
                "name": "Melissa Davis",
                "birthday": "1991-10-10",
                "cpf": "555-2324",
            },
            "10": {
                "name": "Maxwell Miller",
                "birthday": "1984-11-11",
                "cpf": "555-2526",
            },
            "11": {
                "name": "Michelle Anderson",
                "birthday": "1993-12-12",
                "cpf": "555-2728",
            },
            "12": {
                "name": "Mark Thomas",
                "birthday": "1981-01-13",
                "cpf": "555-2930",
            },
            "13": {
                "name": "Maria Garcia",
                "birthday": "1994-02-14",
                "cpf": "555-3132",
            },
            "14": {
                "name": "Martin Rodriguez",
                "birthday": "1987-03-15",
                "cpf": "555-3334",
            },
            // Continue adding more patients as needed
        };

        //-- Create a default localStorage to patients
        if (localStorage.getItem(this.table) == null) {
            localStorage.setItem(this.table, JSON.stringify(this.patients));
        }

        //-- Save the increment like last key in patient object
        this.increment = Object.keys(this.getData()).length;
    }


}