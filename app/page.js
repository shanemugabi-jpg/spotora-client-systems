export default function Zone7Page() {
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.name === item.name);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const changeQty = (name, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name ? { ...item, qty: item.qty + amount } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const filteredMenu = menu
    .map((section) => ({
      ...section,
      items: (section.items || []).filter((item) => {
        const q = search.toLowerCase();

        return (
          section.category.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q)
        );
      }),
    }))
    .filter(
      (section) =>
        section.category.toLowerCase().includes(search.toLowerCase()) ||
        section.items.length > 0
    );

  const sendOrder = () => {
    if (!table.trim()) {
      alert("Please enter the table number first.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const orderText = cart
      .map(
        (item) =>
          `${item.qty}× ${item.name} — UGX ${(
            item.price * item.qty
          ).toLocaleString()}`
      )
      .join("%0A");

    const message =
      `🍽️ New Zone 7 Order%0A%0A` +
      `Table: ${table}%0A%0A` +
      `${orderText}%0A%0A` +
      `Total: UGX ${total.toLocaleString()}%0A%0A` +
      (notes ? `Notes: ${notes}%0A%0A` : "") +
      `Powered by Spotora`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <main className="container">
      <section className="hero">
        <h1>ZONE 7</h1>
        <p>FOOD · DRINKS · EVENTS</p>
        <p className="gold-text">QR Ordering by Spotora</p>
      </section>

      <section className="controls">
        <label>Enter Table Number</label>
        <input
          value={table}
          onChange={(e) => setTable(e.target.value)}
          placeholder="Example: Table 12"
        />

        <label>Search Menu</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food, drinks, category, ingredients..."
        />
      </section>

      <section>
        {filteredMenu.map((section) => (
          <div key={section.category} className="menu-section">
            <h2>{section.category}</h2>

            {(section.items || []).map((item) => (
              <article key={`${section.category}-${item.name}-${item.price}`}>
                <div>
                  <h3>{item.name}</h3>

                  {item.description && <p>{item.description}</p>}

                  <p className="price">UGX {item.price.toLocaleString()}</p>
                </div>

                <button onClick={() => addItem(item)}>Add</button>
              </article>
            ))}
          </div>
        ))}
      </section>

      <section className="cart-bar">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.name} className="cart-row">
                <span>
                  {item.qty}× {item.name}
                </span>

                <div>
                  <button onClick={() => changeQty(item.name, -1)}>−</button>
                  <button onClick={() => changeQty(item.name, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes e.g. no onions, takeaway..."
        />

        <button onClick={sendOrder} className="send-btn">
          Send Order · UGX {total.toLocaleString()}
        </button>
      </section>
    </main>
  );
}
