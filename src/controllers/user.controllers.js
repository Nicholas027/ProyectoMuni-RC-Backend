import bcrypt from "bcrypt";
import User from "../database/models/user.js";
import generarJWT from "../helpers/generarJWT.js";

export const userRegister = async (req, res) => {
  try {
    const { password, email } = req.body;

    const userEmailSearch = await User.findOne({ email });
    if (userEmailSearch) {
      return res
        .status(400)
        .json({ message: "Ya existe un usuario con el email enviado" });
    }

    const newUser = new User(req.body);

    const hashSalts = process.env.HASH_SALTS;
    const salt = bcrypt.genSaltSync(parseInt(hashSalts));
    const hashedPassword = bcrypt.hashSync(password, salt);

    newUser.password = hashedPassword;

    const savedUser = await newUser.save();

    res.status(201).json({
      user: savedUser,
      mensaje: "El usuario fue registrado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensage: "Hubo un error al procesar la solicitud",
      error: error.message,
    });
  }
};

export const usersList = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      mensaje: "No se pudo obtener la lista de usuarios.",
    });
  }
};

export const userDelete = async (req, res) => {
  try {
    const buscarUsuario = await User.findById(req.params.id)
    if (!buscarUsuario) {
      return res.status(404).json({
        mensaje: "No se pudo eliminar al usuario, el id es incorrecto"
      })
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
      mensaje: "El usuario fue eliminado correctamente"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      mensaje: "Ocurrió un error al intentar eliminar el usuario"
    })
  }
}

// export const userSignIn = async (req, res) => {
//   try {
//     const { password, email } = req.body;

//     const usuarioBuscado = await User.findOne({ email });
//     if (!usuarioBuscado) {
//       return res
//         .status(400)
//         .json({ message: "Correo o password incorrecto - correo" });
//     }

//     const passwordValido = bcrypt.compareSync(
//       (password),
//       (usuarioBuscado.password)
//     );

//     if (!passwordValido) {
//       return res
//         .status(400)
//         .json({ mensaje: "Correo o password incorrecto - password" });
//     }
//     //generar el token
//     // const token = await generarJWT(usuarioBuscado._id, usuarioBuscado.email);
//     res.status(200).json({
//       message: "El usuario existe",
//       email: usuarioBuscado.email,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       mensaje: "Error al intentar loguear un profesional",
//     });
//   }
// };

export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    //verificar si el email ya esta guardado
    const usuarioBuscado = await User.findOne({ email });
    if (!usuarioBuscado) {
      //si no existe un usuario con el mail
      return res
        .status(400)
        .json({ mensaje: "Email o password incorrecto - email" });
    }
    const passwordValido = bcrypt.compareSync(
      password,
      usuarioBuscado.password
    );
    if (!passwordValido) {
      return res
        .status(400)
        .json({ mensaje: "Email o password incorrecto - password" });
    }
    //generar el token
    const token = await generarJWT(usuarioBuscado._id, usuarioBuscado.email);
    res.status(200).json({
      message: "El usuario existe",
      email: usuarioBuscado.email,
      nombre: usuarioBuscado.nombre,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ocurrio un error durante el login",
    });
  }
};
