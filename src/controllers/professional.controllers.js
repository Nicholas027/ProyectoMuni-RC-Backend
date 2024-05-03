import bcrypt from "bcrypt";
import Professional from "../database/models/professional.js";
import generarJWT from "../helpers/generarJWT.js";
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs/promises';
import path from 'path';

export const professionalRegister = async (req, res) => {
  try {
    const { dni, password, email } = req.body;

    const professionalEmailSearch = await Professional.findOne({ email });
    if (professionalEmailSearch) {
      return res
        .status(400)
        .json({ message: "Ya existe un profesional con el email enviado" });
    }

    const professionalDniSearch = await Professional.findOne({ dni });
    if (professionalDniSearch) {
      return res.status(400).json({
        message: "Ya existe un profesional con el dni enviado",
      });
    }

    const newProfessional = new Professional(req.body);

    const hashSalts = process.env.HASH_SALTS;
    const salt = bcrypt.genSaltSync(parseInt(hashSalts));
    const hashedPassword = bcrypt.hashSync(password, salt);

    newProfessional.pass = hashedPassword;
    newProfessional.pendiente = true;

    const savedProfessional = await newProfessional.save();

    res.status(201).json({
      profesional: savedProfessional,
      mensaje: "El profesional fue registrado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensage: "Hubo un error al procesar la solicitud",
      error: error.message,
    });
  }
};

export const professionalsList = async (req, res) => {
  try {
    const profesionales = await Professional.find();
    res.status(200).json(profesionales);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      mensaje: "No se pudo obtener la lista de profesionales.",
    });
  }
};

export const professionalAlone = async (req, res) => {
  try {
    const profesionalBuscado = await Professional.findById(req.params.id);
    res.status(200).json(profesionalBuscado);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      mensaje: "No se encontró el profesional buscado.",
    });
  }
};

export const professionalEdit = async (req, res) => {
  try {
    const buscarProfesional = await Professional.findById(req.params.id)
    if (!buscarProfesional) {
      return res.status(404).json({
        mensaje: "No se pudo editar el profesional, el id es incorrecto"
      })
    }
    await Professional.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
      mensaje: "El profesional fue modificado exitosamente"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      mensaje: "Ocurrió un error al intentar editar el profesional"
    })
  }
}

export const professionalDelete = async (req, res) => {
  try {
    const buscarProfesional = await Professional.findById(req.params.id)
    if (!buscarProfesional) {
      return res.status(404).json({
        mensaje: "No se pudo eliminar al profesional, el id es incorrecto"
      })
    }
    await Professional.findByIdAndDelete(req.params.id)
    res.status(200).json({
      mensaje: "El profesional fue eliminado correctamente"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      mensaje: "Ocurrió un error al intentar eliminar el profesional"
    })
  }
}

export const modificarEstadoProfesional = async (req, res) => {
  const { id } = req.params;
  const { pendiente } = req.body;
  try {
    const profesional = await Professional.findByIdAndUpdate(
      id,
      { pendiente },
      { new: true }
    );

    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    res.status(200).json({ message: 'Estado del profesional actualizado exitosamente', profesional });
  } catch (error) {
    console.error('Error al actualizar el estado del profesional:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export const professionalAdminRegister = async (req, res) => {
  try {
    const { dni, password, email } = req.body;

    const professionalEmailSearch = await Professional.findOne({ email });
    if (professionalEmailSearch) {
      return res.status(400).json({ message: "Ya existe un profesional con el email proporcionado" });
    }

    const professionalDniSearch = await Professional.findOne({ dni });
    if (professionalDniSearch) {
      return res.status(400).json({ message: "Ya existe un profesional con el DNI proporcionado" });
    }

    const newProfessional = new Professional(req.body);

    const hashSalts = process.env.HASH_SALTS;
    const salt = bcrypt.genSaltSync(parseInt(hashSalts));
    const hashedPassword = bcrypt.hashSync(password, salt);

    newProfessional.password = hashedPassword;
    newProfessional.pendiente = false;

    const savedProfessional = await newProfessional.save();

    res.status(201).json({
      profesional: savedProfessional,
      mensaje: "El profesional ha sido registrado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Hubo un error al procesar la solicitud",
      error: error.message,
    });
  }
};

export const professionalsListCategory = async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const profesionales = await Professional.find({
      categoria: { $regex: new RegExp('^' + categoria + '$', 'i') }
    });
    res.status(200).json(profesionales);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error del servidor, no se pudo obtener la lista de profesionales.",
      error: error
    });
  }
};

export const professionalsCategories = async (req, res) => {
  try {
    const categorias = Professional.schema.path('categoria').enumValues;
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error)
    res.status(404).json({
      mensaje: "No se pudieron obtener las categorías"
    })
  }
}

export const searchProfessionals = async (req, res) => {
  try {
    const { categoria, search } = req.params;
    const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedProfessionals = await Professional.find({
      categoria: { $regex: new RegExp('^' + categoria + '$', 'i') }
    }).lean().exec();

    const filteredProfessionals = normalizedProfessionals.filter(profesional => {
      const normalizedName = profesional.nombreCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedName.toLowerCase().includes(normalizedSearch.toLowerCase());
    });

    res.json(filteredProfessionals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar profesionales.' });
  }
};

export const agregarComentario = async (req, res) => {
  const { id } = req.params;
  const { autor, emailAutor, calificacion, tituloComentario, descripcion } = req.body;

  try {
      // Buscar al profesional por su ID
      const profesional = await Professional.findById(id);

      if (!profesional) {
          return res.status(404).json({ mensaje: "Profesional no encontrado" });
      }

      // Agregar el nuevo comentario al array de comentarios
      profesional.comentarios.push({ autor, emailAutor, calificacion, tituloComentario, descripcion });

      // Calcular la nueva calificación promedio
      let totalCalificacion = 0;
      profesional.comentarios.forEach(comentario => {
          totalCalificacion += comentario.calificacion;
      });
      profesional.calificacion = totalCalificacion / profesional.comentarios.length;

      // Guardar los cambios en la base de datos
      await profesional.save();

      return res.status(200).json({ mensaje: "Comentario agregado exitosamente", profesional });
  } catch (error) {
      console.error("Error al agregar comentario:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const profesionalBuscado = await Professional.findOne({ email });
    if (!profesionalBuscado) {
      return res.status(400).json({
        mensaje: "Correo o password incorrecto - correo",
      });
    }
    if (!profesionalBuscado.pendiente) {
      return res.status(400).json({
        mensaje: "El perfil del profesional aún no ha sido activado.",
      });
    }
    const passwordValido = bcrypt.compareSync(
      password,
      profesionalBuscado.password
    );
    if (!passwordValido) {
      return res.status(400).json({
        mensaje: "Correo o password incorrecto - password",
      });
    }
    const token = await generarJWT(profesionalBuscado._id, profesionalBuscado.email);
    res.status(200).json({
      mensaje: "Los datos son correctos",
      email: email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al intentar loguear un profesional",
    });
  }
}

export const saveCV = async (req, res) => {
  try {
    const { id } = req.params;
    const { buffer, originalname } = req.file;

    const filePath = path.join(process.cwd(), 'tmp', originalname);
    await fs.writeFile(filePath, buffer);

    const uploadOptions = {
      resource_type: 'auto',
      folder: `cvs/${id}`,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    const profesional = await Professional.findById(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    profesional.cv = result.secure_url;
    await profesional.save();

    await fs.unlink(filePath);

    res.status(200).json({ message: 'CV actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar CV:', error);
    res.status(500).json({ error: 'Error al actualizar CV' });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { buffer, originalname } = req.file;

    const filePath = path.join(process.cwd(), 'tmp', originalname);
    await fs.writeFile(filePath, buffer);

    const uploadOptions = {
      resource_type: 'auto',
      folder: `profile_photos/${id}`,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    const profesional = await Professional.findById(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    profesional.foto = result.secure_url;
    await profesional.save();

    await fs.unlink(filePath);

    res.status(200).json({ message: 'Foto de perfil actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la foto de perfil:', error);
    res.status(500).json({ error: 'Error al actualizar la foto de perfil' });
  }
};

export const searchProfessionalsIndex = async (req, res) => {
  try {
    const { search } = req.params;
    const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedProfessionals = await Professional.find({
      nombreCompleto: {$regex: new RegExp(normalizedSearch, 'i') }
    })
    const filteredProfessionals = normalizedProfessionals.filter(
      profesional => {
        const normalizedName = profesional.nombreCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedName.toLowerCase().includes(normalizedSearch.toLowerCase());
      }
    )
    res.json(filteredProfessionals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar profesionales.' });
  }
};