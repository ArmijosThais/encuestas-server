// app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./dbConfig.js"; // Importa la configuración de la base de datos
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());


// Ruta para insertar una nueva respuesta
app.post("/respuestas", async (req, res) => {
  try {
    const userId = uuidv4(); // Generar un UUID único para el usuario

    const respuestas = Object.entries(req.body).flatMap(([key, value]) => {
      if (key === "otros") {
        return []; // Ignorar el arreglo "otros" para las respuestas generales
      }
      return value;
    });

    const otrosRespuestas = req.body.otros.filter(
      (respuesta) => typeof respuesta === "object" && respuesta !== null
    );

    const ip_usuario = req.ip; // Obtener la IP del usuario

    // Insertar las respuestas en la tabla respuestas
    for (const respuesta of respuestas) {
      // Verificar si la respuesta es un objeto o un valor primitivo
      if (typeof respuesta === "object" && respuesta !== null) {
        const { formulario_id, pregunta_id, opcion_id, respuesta_texto } =
          respuesta;

        // Insertar la respuesta en la tabla respuestas
        await db.query(
          "INSERT INTO respuestas (usuario_id, formulario_id, pregunta_id, opcion_id, respuesta_texto, ip_usuario) VALUES (?, ?, ?, ?, ?, ?)",
          [
            userId,
            formulario_id,
            pregunta_id,
            opcion_id,
            respuesta_texto,
            ip_usuario,
          ]
        );
      }
    }

    // Insertar las respuestas "otros" en la tabla opciones_otra
    for (const respuesta of otrosRespuestas) {
      const { pregunta_id, respuesta_otra_texto } = respuesta;

      // Insertar la respuesta en la tabla opciones_otra
      await db.query(
        "INSERT INTO opciones_otra (usuario_id, pregunta_id, respuesta_otra_texto) VALUES (?, ?, ?)",
        [userId, pregunta_id, respuesta_otra_texto]
      );
    }

    res.status(201).json({
      respuestas,
    });
  } catch (error) {
    console.error("Error al insertar las respuestas:", error);
    res.status(500).json({ error: "Error al insertar las respuestas" });
  }
});

app.get("/formulario/:id", async (req, res) => {
  try {
    const formularioId = req.params.id;

    // Consulta SQL para obtener las preguntas y opciones de respuesta del formulario específico
    const sql =
      "SELECT p.id AS id, p.numero_pregunta AS question_number, p.titulo AS title, p.texto AS question, JSON_ARRAYAGG(JSON_OBJECT('id', o.id,'question_option', o.numero_opcion,'name', p.alias,'label', o.label)) AS options,p.tipo_pregunta AS questionType,0 AS isOpenQuestion FROM preguntas p JOIN opciones o ON p.id = o.pregunta_id WHERE p.formulario_id = ? GROUP BY p.id, p.numero_pregunta, p.titulo, p.alias, p.tipo_pregunta ORDER BY p.id;";

    const [rows, fields] = await db.query(sql, [formularioId]);

    // Obtener solo las preguntas y enviarlas como respuesta
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    res.status(500).json({ error: "Error al obtener las preguntas" });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
