const express = require("express")
const cors = require("cors")
const app = express()
const productRoutes = require("../routes/product")
const orderRoutes =  require("../routes/order")
const orderItemRoutes = require("../routes/orderItem")
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use("/orders", orderRoutes)
app.use("/products", productRoutes)
app.use("/order-items", orderItemRoutes)
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

app.get("/", (req, res) => {
    res.send("Hello World!")
})
