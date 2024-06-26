import React, { useState, useEffect } from "react";
import "../css/Bag.css";
import cart from "../Assets/addcart.svg";
import { Link, useLocation } from "react-router-dom";

const SideBar2 = ({ selectedItem }) => {
  // Load bagItems and counter from localStorage on component mount
  const [bagItems, setBagItems] = useState(() => {
    const storedItems = localStorage.getItem("bagItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const [counter, setCounter] = useState(() => {
    const storedCounter = localStorage.getItem("counter");
    return storedCounter ? parseInt(storedCounter) : 0;
  });

  const [isEffectActive, setIsEffectActive] = useState(true);

  const location = useLocation();

  // Calculate total price of all items in bag
  useEffect(() => {
    let total = 0;
    bagItems.forEach((item) => {
      total += item.price;
    });
    setTotalPrice(total);
  }, [bagItems]);

  // Original effect to add items to bagItems
  useEffect(() => {
    if (selectedItem && isEffectActive) {
      setBagItems((prevBagItems) => {
        const newBagItem = {
          id: selectedItem.id,
          title: selectedItem.title,
          description: selectedItem.description,
          shortDescription: selectedItem.shortDescription,
          rating: selectedItem.rating,
          price: selectedItem.price,
          currency: selectedItem.currency,
          imageUrl: selectedItem.imageUrl,
          // Include other necessary properties from selectedItem
        };
        return [...prevBagItems, newBagItem];
      });

      // Increment counter
      setCounter((prevCounter) => prevCounter + 1);
    }
  }, [selectedItem, isEffectActive]);

  // Effect to save bagItems and counter to localStorage
  useEffect(() => {
    localStorage.setItem("bagItems", JSON.stringify(bagItems));
    localStorage.setItem("counter", counter.toString());
  }, [bagItems, counter]);

  // Effect to disable original effect after 9 runs
  useEffect(() => {
    if (counter === 9) {
      setIsEffectActive(false);
    }
  }, [counter]);

  // Group bag items into rows of three
  const rows = [];
  for (let i = 0; i < bagItems.length; i += 3) {
    rows.push(bagItems.slice(i, i + 3));
  }

  // Function to clear localStorage on page refresh
  const clearLocalStorageOnRefresh = () => {
    localStorage.clear();
  };

  // Attach event listener to clear localStorage on page refresh
  useEffect(() => {
    window.addEventListener("beforeunload", clearLocalStorageOnRefresh);

    return () => {
      window.removeEventListener("beforeunload", clearLocalStorageOnRefresh);
    };
  }, []);

  return (
    <div className="bag-area">
      <div className="title">
        <h3>bag</h3>
      </div>
      <div className="bag-items">
        {/* Render rows */}
        {rows.map((row, index) => (
          <div className="row" key={index}>
            {/* Render items in the row */}
            {row.map((item) => (
              <div className="bag-item" key={item.id}>
                <img src={item.imageUrl} alt="Bag item" />
              </div>
            ))}
          </div>
        ))}
      </div>
      {location.pathname === "/bag" && ( // Render total only on bag page
        <div className="total-price">Bag Total: ${totalPrice.toFixed(2)}</div>
      )}
      {location.pathname === "/bag" ? (
        <Link to="/checkout" className="button">
          <div>
            <img src={cart} alt="Logo" />
            <span>Checkout</span>
          </div>
        </Link>
      ) : (
        <Link to="/bag" className="button">
          <div>
            
            <span>ViewBag</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SideBar2;
