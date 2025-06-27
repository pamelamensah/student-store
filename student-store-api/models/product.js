const {PrismaClient, Prisma} = require('@prisma/client');
const { options } = require('../routes/product');
const prisma = new PrismaClient();


class Product{
    constructor(id, name, description, price, image_url, category){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image_url = image_url;
        this.category = category;
    }


    static async getAll(query = {}){ 
        const {category, sort, order, search,minPrice, maxPrice} = query;
        const options = {
            
        }
        if (category){
            options.where = {
                ...options.where,
                category:{
                    equals: category,
                    mode: "insensitive"
                }
            }
        }
        if (sort === "price" || sort === "name"){
            options.orderBy = {
                [sort]: order === "desc" ? "desc" : "asc"
            }
        }
        const priceFilter = {}
        if (!options.where) options.where = {}
        if (minPrice) priceFilter.gte = new Prisma.Decimal(minPrice)
        if (maxPrice) priceFilter.lte = new Prisma.Decimal(maxPrice)
        
        if (Object.keys(priceFilter).length > 0) {
            options.where.price = priceFilter
        }
        
        if (search){
            options.where = {
                ...options.where,
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        }
        if (!options.orderBy){
            options.orderBy = {
                id: "asc"
            }
        }

        return await prisma.product.findMany(options)
    }

    static async getById(id){
        return await prisma.product.findUnique({
            where: {
                id : Number(id)
            }
        })
    }

    static async create(data){
        return await prisma.product.create({
            data
        })
    }

    static async update(id, data){
        return await prisma.product.update({
            where: {
                id: Number(id)
            },
            data
        })
    }

    static async delete(id){
        const exists = await prisma.product.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!exists){
            throw new Error('Product not found')
        }
        return await prisma.product.delete({
            where:{
                id: Number(id)
            }
        })
    }

}
module.exports = Product;
