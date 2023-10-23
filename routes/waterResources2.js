const express = require("express");
const { check, validationResult } = require("express-validator");
const WaterResourcesService = require("../services/waterresources2");
const WaterResource2 = require("../models/WaterResources2");

const router = express.Router();
//app.use("/api/waterresources", router);

router.get("/", async function (req, res) {
    try {
        const waterResources2 = await WaterResource2.find();
        res.status(200);
        res.send(waterResources2);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/:name", async function (req, res) {
    try {
        const { name } = req.params;
        const waterResource2 = await WaterResourcesService.getResources({ name });
        res.status(200).json(waterResource2);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/:name/date/", async function (req, res) {
    try {
        const { name } = req.params;
        const waterResource2 = await WaterResourcesService.getResources({ name });
        res.status(200).json(waterResource2.date);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/:name/date/:index", async function (req, res) {
    try {
        const { name, index } = req.params;
        const waterResource2 = await WaterResourcesService.getResources({ name });
        res.status(200).json(waterResource2.date[index]);
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
            const waterResource2 = new WaterResource2(req.body);
            const resorceId = await WaterResourcesService.createResources({
                waterResource2,
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
            const { body: waterResource2 } = req;
            console.log(waterResource2);
            const fuente = await WaterResourcesService.get({ waterResourcesId });

            if (fuente) {
                const resorceId = await WaterResourcesService.updateResources({
                    waterResourcesId,
                    waterResource2,
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
        const waterResource2 = await WaterResourcesService.getResources({ name });


        if (waterResource2 && waterResource2.valoracion) {
            if (waterResource2.valoracion.pH && waterResource2.valoracion.pH.length > index) {
                waterResource2.valoracion.pH.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for pH array` });
            }if (waterResource2.valoracion.conductivity && waterResource2.valoracion.conductivity.length > index) {
                waterResource2.valoracion.conductivity.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for conductivity array` });
            }if (waterResource2.valoracion.turbidity && waterResource2.valoracion.turbidity.length > index) {
                waterResource2.valoracion.turbidity.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for turbidity array` });
            }if (waterResource2.valoracion.temperature && waterResource2.valoracion.temperature.length > index) {
                waterResource2.valoracion.temperature.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for temperature array` });
            }if (waterResource2.valoracion.depth && waterResource2.valoracion.depth.length > index) {
                waterResource2.valoracion.depth.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for depth array` });
            }if (waterResource2.date && waterResource2.date.length > index) {
                waterResource2.date.splice(index, 1);
            }else {
                return res.status(400).json({ error: `Index ${index} is out of range for date array` });
            }
        }else {
            return res.status(400).json({ error: `Could not find the specified water resource or valoracion` });
        }
        // Remove the value at the specified index from the array
        

        // Save the updated water resource data
        await waterResource2.save();

        res.status(200).json({ message: `Values at index ${index} of ${name} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;

