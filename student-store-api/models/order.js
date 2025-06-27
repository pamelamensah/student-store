const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class Order{
    static async getAll(){
        return await prisma.order.findMany()
    }

    static async getById(id){
        return await prisma.order.findUnique({
            where: {
                id: Number(id)
            }
        })
    }

    static async create({ customer_id, email, status, total_price, items }) {
        const order = await prisma.order.create({
            data: {
            customer: customer_id,
            email,
            status,
            total: total_price,
            }
        });

        if (Array.isArray(items)) {
            for (const item of items) {
            await prisma.orderItem.create({
                data: {
                orderId: order.id,
                productId: item.product_id,
                quantity: item.quantity,
                price: item.price
                }
            });
            }
        } else {
            console.warn("🟡 Warning: No valid items array provided in request body");
        }

        return await prisma.order.findUnique({
            where: { id: order.id },
            include: { orderItems: true }
        });
    }


    static async update(id, data){
        return await prisma.order.update({
            where: {
                id: Number(id)
            },
            data
        })
    }

    static async delete(id){
        return await prisma.order.delete({
            where: {
                id: Number(id)
            }
        })
    }

    
    /*static async getWithItems(id){
        return await prisma.order.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }*/
    static async getWithItems(id) {
        return await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                orderItems: {
                    include: {
                        product: true
                   }
                } 
            }
        })
    }

    static async calculateTotal(id){
        const items = await prisma.orderItem.findMany({
            where: {
                orderId: Number(id)
            }            
        })
        return items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0)
    }

}

module.exports = Order;