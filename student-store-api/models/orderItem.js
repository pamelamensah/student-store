const {PrismaClient, Prisma} = require('@prisma/client');
const prisma = new PrismaClient();

class OrderItem{

    static async getAll(){
        return await prisma.orderItem.findMany({
            include: {
                order: true,
                product: true
            }
        })
    }
    static async getByOrderId(orderId){
        return await prisma.orderItem.findMany({
            where: {
                orderId: Number(orderId)
            },
            include: {
                product: true
            }
        })
    }
    static async create(data) {
        const product = await prisma.product.findUnique({
            where: { id: data.productId }
        })

        if (!product) {
            throw new Error("Product not found")
        }

        const orderItem = await prisma.orderItem.create({
            data: {
            orderId: data.orderId,
            productId: data.productId,
            quantity: data.quantity,
            price: product.price // use the real product price
            }
        })

        // Recalculate order total
        const items = await prisma.orderItem.findMany({
            where: { orderId: data.orderId }
        })

        const total = items.reduce((sum, item) => {
            return sum + item.quantity * parseFloat(item.price)
        }, 0)

        await prisma.order.update({
            where: { id: data.orderId },
            data: { total: parseFloat(total.toFixed(2))}
        })

        return orderItem;
    }

    static async delete(id) {
    // Step 1: Find the order item
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: Number(id) }
        });

        if (!orderItem) {
            throw new Error("Order item not found");
       }

        // Step 2: Delete the item
        const deletedItem = await prisma.orderItem.delete({
            where: { id: Number(id) }
        });

        // Step 3: Recalculate order total
        const remainingItems = await prisma.orderItem.findMany({
            where: { orderId: orderItem.orderId }
        });

        const newTotal = remainingItems.reduce((sum, item) => {
            return sum + parseFloat(item.price) * item.quantity;
        }, 0);

        // Step 4: Update the order total
        await prisma.order.update({
            where: { id: orderItem.orderId },
            data: { total: newTotal.toFixed(2) }
        });

        return deletedItem;
    }


}
module.exports = OrderItem;