const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
router.get("/", async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try{
        const order = await Order.getWithItems(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/", async (req, res) => {
    try{
        console.log("Incoming request body:", req.body)
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try{
        const order = await Order.update(req.params.id, req.body);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const order = await Order.delete(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id/total", async (req, res) => {
    try {
        const total = await Order.calculateTotal(req.params.id);
        res.json({total: total.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/debug", async (req, res) => {
    try {
        const order = await Order.getWithItems(1)
        console.log(order.orderItems[0].product.name)
        res.json(order)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.post("/:orderId/items", async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const productId = parseInt(req.body.productId);
        const quantity = parseInt(req.body.quantity);

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const orderItem = await prisma.orderItem.create({
            data: {
                orderId,
                productId,
                quantity,
                price: product.price
            }
        });

        // Recalculate total
        const orderItems = await prisma.orderItem.findMany({
            where: { orderId }
        });

        const newTotal = orderItems.reduce((sum, item) => {
            return sum + parseFloat(item.price) * item.quantity;
        }, 0);

        await prisma.order.update({
            where: { id: orderId },
            data: { total: newTotal.toFixed(2) }
        });

        res.status(201).json(orderItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


module.exports = router;