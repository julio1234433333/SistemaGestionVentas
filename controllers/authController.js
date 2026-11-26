const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
    registrar: async (req, res) => {
        try {
            const { NombreUsuario, Password, } = req.body;

            if (!NombreUsuario || !Password) {
                return res.status(400).json({
                    mensaje: 'Debe indicar usuario y contraseña'
                });
            }

            if (Password.length < 8) {
                return res.status(400).json({
                    mensaje: 'La contraseña debe tener al menos 8 caracteres'
                });
            }

            const existe = await UsuarioModel.obtenerPorNombre(NombreUsuario);

            if (existe) {
                return res.status(409).json({
                    mensaje: 'El nombre de usuario ya existe'
                });
            }

            const PasswordHash = await bcrypt.hash(Password, 12);

            await UsuarioModel.crear({
                NombreUsuario,
                PasswordHash,
                Rol: 'vendedor'
            });

            return res.status(201).json({
                mensaje: 'Usuario registrado correctamente'
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { NombreUsuario, Password } = req.body;

            if (!NombreUsuario || !Password) {
                return res.status(400).json({
                    mensaje: 'Debe indicar usuario y contraseña'
                });
            }

            const usuario = await UsuarioModel.obtenerPorNombre(NombreUsuario);

            if (!usuario || !usuario.Activo) {
                return res.status(401).json({
                    mensaje: 'Usuario o contraseña incorrectos'
                });
            }

            const passwordValida = await bcrypt.compare(
                Password,
                usuario.PasswordHash
            );

            if (!passwordValida) {
                return res.status(401).json({
                    mensaje: 'Usuario o contraseña incorrectos'
                });
            }

            const token = jwt.sign(
                {
                    IdUsuario: usuario.IdUsuario,
                    NombreUsuario: usuario.NombreUsuario,
                    Rol: usuario.Rol
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            return res.status(200).json({
                mensaje: 'Inicio de sesión correcto',
                token
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
};

module.exports = AuthController;
