/*import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PastOrders.css";

const PastOrders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/orders")
        setOrders(res.data)
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="PastOrders">
      <h2>Past Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`}>
                <strong>Order #{order.id}</strong> — {new Date(order.createdAt).toLocaleDateString()} — ${parseFloat(order.total).toFixed(2)} — {order.status}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PastOrders;
*/
import { useEffect, useState } from "react"
import axios from "axios";
import { Link } from "react-router-dom";
import "./PastOrders.css";

const PastOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [emailFilter, setEmailFilter] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/orders")
        setOrders(res.data)
        setFilteredOrders(res.data)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Could not load orders.")
      }
    }

    fetchOrders()
  }, [])

  const handleFilter = () => {
    if (!emailFilter.trim()) {
      setFilteredOrders(orders)
      setError(null)
      return
    }

    const filtered = orders.filter((order) =>
      order.email.toLowerCase().includes(emailFilter.toLowerCase())
    )

    if (filtered.length === 0) {
      setError("No orders found for that email.")
    } else {
      setError(null)
    }

    setFilteredOrders(filtered)
  }

  const handleClear = () => {
    setFilteredOrders(orders)
    setEmailFilter("")
    setError(null)
  }

  return (
    <div className="PastOrders">
      <h2>Past Orders</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Enter email to filter"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {error && <p className="error">{error}</p>}

      {filteredOrders.length === 0 && !error ? (
        <p>No past orders available.</p>
      ) : (
        <ul>
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`}>
                <strong>Order #{order.id}</strong> —{" "}
                {new Date(order.createdAt).toLocaleDateString()} — $
                {parseFloat(order.total).toFixed(2)} — {order.status}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PastOrders;
