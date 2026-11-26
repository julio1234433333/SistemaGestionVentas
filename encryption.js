const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

const obtenerClave = () => {
    const clave = process.env.AES_SECRET_KEY;

    if (!clave || !/^[0-9a-fA-F]{64}$/.test(clave)) {
        throw new Error('AES_SECRET_KEY = 55be26cdd5b0fd1805cca0f3bc853eb79638390a78b6686e70fed7edb61e4463');
    }

    return Buffer.from(clave, 'hex');
};

const cifrar = (texto) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, obtenerClave(), iv);

    let cifrado = cipher.update(String(texto), 'utf8', 'hex');
    cifrado += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
        iv: iv.toString('hex'),
        authTag,
        contenido: cifrado
    };
};

const descifrar = (datos) => {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        obtenerClave(),
        Buffer.from(datos.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(datos.authTag, 'hex'));

    let texto = decipher.update(datos.contenido, 'hex', 'utf8');
    texto += decipher.final('utf8');

    return texto;
};

module.exports = { cifrar, descifrar };
