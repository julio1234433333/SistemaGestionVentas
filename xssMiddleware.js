
const xss = require('xss');

const limpiarDatos = (datos) => {
    if (typeof datos === 'string') {
        return xss(datos);
    }

    if (Array.isArray(datos)) {
        return datos.map(limpiarDatos);
    }

    if (datos !== null && typeof datos === 'object') {
        const limpio = {};

        for (const clave of Object.keys(datos)) {
            limpio[clave] = limpiarDatos(datos[clave]);
        }

        return limpio;
    }

    return datos;
};

const xssMiddleware = (req, res, next) => {
    req.body = limpiarDatos(req.body);
    req.query = limpiarDatos(req.query);

    next();
};

module.exports = xssMiddleware;
