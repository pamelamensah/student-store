import "./CheckoutSuccess.css"

const CheckoutSuccess = ({ order, setOrder,setSidebarOpen }) => {
  const handleOnClose = () => {
    setOrder(null)
    setSidebarOpen(false)
  }

  /*  const renderReceipt = () => (
    <>
      <p className="header">{order.purchase.receipt.lines[0]}</p>
      <ul className="purchase">
        {order.purchase.receipt.lines.slice(1).map((line, idx) => (Boolean(line) ? <li key={idx}>{line}</li> : null))}
      </ul>
    </>
  )
*/
  return (
    <div className="CheckoutSuccess">
      <h3>
        Checkout Info{" "}
        <span className={`icon button`}>
          <i className="material-icons md-48">fact_check</i>
        </span>
      </h3>
      {order? (
        <div className="card">
          <header className="card-head">
            <h4 className="card-title">Receipt</h4>
          </header>
          <section className="card-body">
            <p>✅ Thank you for your order, {order.customer_id}</p>
            <p>🛍️A confirmation email will be sent to <strong>{order.email}</strong></p>
            <ul>
              {order.items?.map((item, idx) => (
                <li key={idx}>
                  {item.quantity} x Product{item.product_id} @ ${item.price?.toFixed(2)}
                  </li>
              ))}
            </ul>
          </section>
          <footer className="card-foot">
            <button className="button is-success" onClick={handleOnClose}>
              Shop More
            </button>
            <button className="button" onClick={handleOnClose}>
              Exit
            </button>
          </footer>
        </div>
      ) : (
        <div className="content">
          <p>
            A confirmation email will be sent to you so that you can confirm this order. Once you have confirmed the
            order, it will be delivered to your dorm room.
          </p>
        </div>
      )}
    </div>
  )
}

export default CheckoutSuccess
