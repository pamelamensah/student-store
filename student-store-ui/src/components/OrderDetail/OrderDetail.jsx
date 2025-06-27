import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./OrderDetail.css"

const OrderDetail = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/orders/${orderId}`)
        setOrder(res.data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Could not load order.")
      }
    }

    fetchOrder()
  }, [orderId])

  if (error) return <p>{error}</p>
  if (!order) return <p>Loading order details...</p>

  return (
    <div className="OrderDetail">
      <h2>Order #{order.id}</h2>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Email:</strong> {order.email}</p>

      <h3>Items:</h3>
      <ul>
        {order.orderItems?.map((item, idx) => (
          <li key={idx}>
            {item.quantity} × {item.product?.name || "Product " + item.productId} @ ${parseFloat(item.price).toFixed(2)}
          </li>
        ))}
      </ul>

      <p><strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}</p>
    </div>
  )
}

export default OrderDetail

