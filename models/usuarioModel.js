
const db = require('../config/knex');

const UsuarioModel = {
    obtenerPorNombre: async (nombreUsuario) => {
        return await db('Usuarios')
            .where({ NombreUsuario: nombreUsuario })
            .first();
    },

    crear: async (usuario) => {
        const [id] = await db('Usuarios').insert({
            NombreUsuario: usuario.NombreUsuario,
            PasswordHash: usuario.PasswordHash,
            Rol: usuario.Rol || 'vendedor',
            Activo: true
        });

        return id;
    }
};

module.exports = UsuarioModel;
