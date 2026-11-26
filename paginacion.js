
function obtenerPaginacion(query) {
    const pageSolicitada = Number(query.page);
    const limitSolicitado = Number(query.limit);

    const page = Number.isInteger(pageSolicitada) && pageSolicitada > 0
        ? pageSolicitada
        : 1;

    const limit = Number.isInteger(limitSolicitado) && limitSolicitado > 0
        ? Math.min(limitSolicitado, 100)
        : 10;

    return {
        page,
        limit,
        offset: (page - 1) * limit
    };
}

module.exports = { obtenerPaginacion };
