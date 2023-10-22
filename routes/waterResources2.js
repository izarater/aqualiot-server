const express = require("express");
const { check, validationResult } = require("express-validator");
const WaterResourcesService = require("../services/waterresources");
const WaterResource = require("../models/WaterResources");

const router = express.Router();
//app.use("/api/waterresources", router);

router.get("/", async function (req, res) {
    try {
        const waterResources = await WaterResource.find();
        res.status(200);
        res.send(waterResources);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/:name", async function (req, res) {
    try {
        const { name } = req.params;
        const waterResource = await WaterResourcesService.getResources({ name });
        res.status(200).json(waterResource);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/:name/date/", async function (req, res) {
    try {
        const { name } = req.params;
        const waterResource = await WaterResourcesService.getResources({ name });
        res.status(200).json(waterResource.date);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/:name/date/:index", async function (req, res) {
    try {
        const { name, index } = req.params;
        const waterResource = await WaterResourcesService.getResources({ name });
        res.status(200).json(waterResource.date[index]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post(
    "/add",
    [
        check("name", "Provide an name").exists(),
        check("valoracion", "Provide an object valoracion").exists(),
        check("coordenadas", "Provide an object coordenadas").exists(),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const waterResource = new WaterResource(req.body);
            const resorceId = await WaterResourcesService.createResources({
                waterResource,
            });
            return res
                .status(200)
                .json({ resorceId: resorceId, msg: "Water Resources successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    "/edit/:waterResourcesId",
    [
        check("name", "Provide an name").exists(),
        check("valoracion", "Provide an object valoracion").exists(),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { waterResourcesId } = req.params;
            const { body: waterResource } = req;
            console.log(waterResource);
            const fuente = await WaterResourcesService.get({ waterResourcesId });

            if (fuente) {
                const resorceId = await WaterResourcesService.updateResources({
                    waterResourcesId,
                    waterResource,
                });
                return res.status(200).json({
                    resorceId: resorceId,
                    msg: "Update Water Resource successfully",
                });
            } else {
                res.status(400).json({ msg: "Water Resource no exist" });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);

router.delete("/:waterResourcesId", async function (req, res) {
    const { waterResourcesId } = req.params;
    try {
        const fuente = await waterServices.get({ waterResourcesId });
        if (fuente) {
            const deleteId = await WaterResourcesService.deletedResources({
                waterResourcesId,
            });
            res.status(200).json({
                idFuente: deleteId,
                msg: "Delete Water Resource successfully",
            });
        } else {
            res.status(400).json({ msg: "Fuente no exist" });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            msg: "Delete Water Resource unsuccessfully",
        });
    }
});


// Delete route for a specific property value by index

router.delete("/:name/deleteValue/:index", async function (req, res) {
    try {
        const { name, index } = req.params;
        const waterResource = await WaterResourcesService.getResources({ name });


        if (waterResource && waterResource.valoracion) {
            if (waterResource.valoracion.pH && waterResource.valoracion.pH.length > index) {
                waterResource.valoracion.pH.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for pH array` });
            }if (waterResource.valoracion.conductivity && waterResource.valoracion.conductivity.length > index) {
                waterResource.valoracion.conductivity.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for conductivity array` });
            }if (waterResource.valoracion.turbidity && waterResource.valoracion.turbidity.length > index) {
                waterResource.valoracion.turbidity.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for turbidity array` });
            }if (waterResource.valoracion.temperature && waterResource.valoracion.temperature.length > index) {
                waterResource.valoracion.temperature.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for temperature array` });
            }if (waterResource.valoracion.depth && waterResource.valoracion.depth.length > index) {
                waterResource.valoracion.depth.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for depth array` });
            }if (waterResource.date && waterResource.date.length > index) {
                waterResource.date.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for date array` });
            }
        }else {
            return res.status(400).json({ error: `Could not find the specified water resource or valoracion` });
        }
        // Remove the value at the specified index from the array
        

        // Save the updated water resource data
        await waterResource.save();

        res.status(200).json({ message: `Values at index ${index} of ${name} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;

