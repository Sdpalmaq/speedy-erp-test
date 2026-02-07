// validar cedula ecuatoriana

function validateCedula(cedula) {
    if (!cedula || cedula.length !== 10) {
        return false;
    }

    // Verificar que solo sean numeros
    if (!/^\d+$/.test(cedula)) {
        return false;
    }

    // Primeros dos dígitos corresponden a la provincia (01-24)
    const provinceCode = parseInt(cedula.substring(0, 2), 10);
    if (provinceCode < 1 || provinceCode > 24) {
        return false;
    }

    // algoritmo de luhn para validar la cedula
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i]) * coefficients[i];
        if (valor >= 10) {
            valor -= 9;
        }
        sum += valor;
    }

    const digitoVerificador = parseInt(cedula[9]);
    const resultado = sum % 10;
    const valorEsperado = resultado === 0 ? 0 : 10 - resultado;

    return digitoVerificador === valorEsperado;

}

// validar un RUC ecuatoriano (13 dígitos)

function validateRUC(ruc) {
    if (!ruc || ruc.length !== 13) {
        return false;
    }

    // Verificar que solo sean numeros
    if (!/^\d+$/.test(ruc)) {
        return false;
    }

    const tercerDigito = parseInt(ruc[2]);

    // Validar RUC de persona natural
    if (tercerDigito < 6) {
        const cedula = ruc.substring(0, 10);
        const establecimiento = ruc.substring(10, 13);
        return validateCeduala(cedula) && establecimiento === '001';
    }

    // Validar RUC de sociedad privada o pública
    if (tercerDigito === 6 || tercerDigito === 9) {
        const coefficients = [3, 2, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += parseInt(ruc[i]) * coefficients[i];
        }
        const digitoVerificador = parseInt(ruc[8]);
        const resultado = sum % 11;
        const valorEsperado = resultado === 0 ? 0 : 11 - resultado;
        return digitoVerificador === valorEsperado;
    }
    return false;
}

// Funcion principal para validar cedula o RUC (TaxID)

function validateTaxID(taxID) {
    if (!taxID) {
        return { valid: false, message: 'Identificación no proporcionada' };
    }

    const cleaned = taxID.trim();

    if (cleaned.length === 10) {
        if (validateCedula(cleaned)) {
            return { valid: true, type: 'CEDULA', message: 'Cédula válida' };
        }
        return { valid: false, message: 'Cédula inválida' };
    }

    if (cleaned.length === 13) {
        if (validateRUC(cleaned)) {
            return { valid: true, type: 'RUC', message: 'RUC válido' };
        }
        return { valid: false, message: 'RUC inválido' };
    }

    return { valid: false, message: 'Debe tener 10 dígitos (Cédula) o 13 dígitos (RUC)' };
}

module.exports = {
    validateCedula,
    validateRUC,
    validateTaxID,
};

