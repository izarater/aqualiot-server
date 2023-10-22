const WaterResource = require("../models/WaterResources");
const moment = require("moment");

exports.getListResources = async () => {
    await WaterResource.find({}).exec();
};

exports.getResources = async ({ name }) => {
    try {
        const waterResource = await WaterResource.findOne({ name });
        return waterResource; // Return the retrieved data
    } catch (error) {
        throw error;
    }
};

exports.get = async ({ waterResourcesId }) => {};

exports.updateResources = async ({ waterResourceExists, valoracion}) => {
    waterResourceExists.valoracion.pH.push(valoracion.pH[0]);
    waterResourceExists.valoracion.conductivity.push(valoracion.conductivity[0]);
    waterResourceExists.valoracion.temperature.push(valoracion.temperature[0]);
    waterResourceExists.valoracion.turbidity.push(valoracion.turbidity[0]);
    waterResourceExists.valoracion.depth.push(valoracion.depth[0]);
    date_now = moment().subtract(5, 'hours').format("MMMM Do YYYY, h:mm:ss a");
    waterResourceExists.date.push(date_now)
    await WaterResource.findOneAndUpdate(
        { _id: waterResourceExists._id },
        { $set: waterResourceExists },
        { new: true }
    );
};

exports.createResources = async ({ waterResource }) => {
    let createWaterResourceId = null;
    const { name, valoracion } = waterResource;
    const waterResourceExists = await WaterResource.findOne({ name });
    if (waterResourceExists) {
        createWaterResourceId = this.updateResources({ waterResourceExists, valoracion });
    } else {
        waterResource.date[0] = moment().subtract(5, 'hours').format("MMMM Do YYYY, h:mm:ss a");
        createWaterResourceId = await waterResource.save();
    }
    return createWaterResourceId;
};
