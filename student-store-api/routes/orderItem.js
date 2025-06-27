const express = require("express");
const router = express.Router();
const OrderItem = require("../models/orderItem");

router.get("/", async (req, res) => {
    try{
        const items = await OrderItem.getAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try{
        const orderItem = await OrderItem.create(req.body);
        res.status(201).json(orderItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const deleted = await OrderItem.delete(req.params.id);
        res.json({
            message: "OrderItem deleted",
            deleted
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;