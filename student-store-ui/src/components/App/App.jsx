import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import CheckoutSuccess from "../CheckoutSuccess/CheckoutSuccess"
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart";
import "./App.css";
import PastOrders from "../PastOrders/PastOrders";
import OrderDetail from "../OrderDetail/OrderDetail";


function AppContent() {

  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: ""});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true)
      try {
        const res = await axios.get("/products") 
        setProducts(res.data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError("Error fetching products")
      } finally {
        setIsFetching(false)
      }
    }

    fetchProducts()
  }, [])

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const handleOnCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      setError("Please add items to your cart before checking out.")
      return;
    }
    try {
      setIsCheckingOut(true)
      setError(null)

      const cartItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find((p) => p.id === parseInt(productId))
        return {
          product_id: product.id,
          quantity,
          price: product.price
        }
      })

      const total_price = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )

      const payload = {
        customer_id: userInfo.name,
        email: userInfo.email,
        status: "pending",
        total_price,
        items: cartItems
      }

      const res = await axios.post("http://localhost:3000/orders", payload)

      setOrder(res.data)
      setCart({})
      setUserInfo({ name: "", email: "" })
      navigate("/success")
    } catch (err) {
      console.error("❌ Checkout error:", err)
      setError("There was an error checking out. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }



  return (
    <div className="App">
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route 
              path="/orders" 
              element={
                <PastOrders
                />
              } 
            />
            <Route
              path="/success"
              element={
                <CheckoutSuccess
                  order={order}
                  setOrder={setOrder}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <OrderDetail
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App;
 