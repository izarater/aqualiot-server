const mongoose = require("mongoose");

const fuenteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    valoracion: {
        pH: [{
            type: String,
            default: [],
        }],
        conductivity: [{
            type: Number,
            default: [],
        }],
        turbidity: [{
            type: Number,
            default: [],
        }],
        temperature: [{
            type: String,
            default: [],
        }],
        depth: [{
            type: Number,
            default: [],
        }],
    },
    coordenadas: {
        type: Object,
        required: false,
        latitud: {
            type: Number,
            default: 0,
        },
        longitud: {
            type: Number,
            default: 0,
        },
    },
    date: [{
        type: String,
        required: true,
    }],
    idDispositivo: {
        type: Number,
        default: 0,
        required: false,
    },
});

module.exports = mongoose.model("WaterResource", fuenteSchema);
