function StockManagementApp() {
  const [stock, setStock] = React.useState([
    { id: 1, name: 'Widget A', quantity: 50, price: 9.99, category: 'Electronics' },
    { id: 2, name: 'Gadget B', quantity: 30, price: 19.99, category: 'Electronics' },
    { id: 3, name: 'Doohickey C', quantity: 20, price: 14.99, category: 'Tools' },
  ]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newItem, setNewItem] = React.useState({ name: '', quantity: '', price: '', category: '' });
  const [editingId, setEditingId] = React.useState(null);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [reportData, setReportData] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const categories = ['All', ...new Set(stock.map(item => item.category))];

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    if (field === 'firstName') {
      setFirstName(value);
    } else if (field === 'lastName') {
      setLastName(value);
    } else if (field === 'searchTerm') {
      setSearchTerm(value);
    } else {
      setNewItem((prev) => {
        if (field === 'price') {
          // Allow empty string or valid number for price
          const newValue = value === '' ? '' : parseFloat(value);
          return { ...prev, [field]: isNaN(newValue) ? prev[field] : newValue };
        } else if (field === 'quantity') {
          // Allow empty string or valid integer for quantity
          const newValue = value === '' ? '' : parseInt(value, 10);
          return { ...prev, [field]: isNaN(newValue) ? prev[field] : newValue };
        } else {
          return { ...prev, [field]: value };
        }
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleAddOrUpdateItem = () => {
    if (newItem.name && newItem.quantity && newItem.price && newItem.category) {
      if (editingId) {
        setStock(stock.map((item) => (item.id === editingId ? { ...newItem, id: editingId } : item)));
        setEditingId(null);
      } else {
        setStock([...stock, { ...newItem, id: stock.length + 1, quantity: parseInt(newItem.quantity), price: parseFloat(newItem.price) }]);
      }
      setNewItem({ name: '', quantity: '', price: '', category: '' });
      setIsModalOpen(false);
    }
  };

  const handleEditItem = (id) => {
    const itemToEdit = stock.find((item) => item.id === id);
    setNewItem({ ...itemToEdit });
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    setStock(stock.filter((item) => item.id !== id));
  };

  const openAddModal = () => {
    setNewItem({ name: '', quantity: '', price: '', category: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const generateStockReport = () => {
    const filteredStock = selectedCategory === 'All'
      ? stock
      : stock.filter(item => item.category === selectedCategory);

    const report = filteredStock.map((item) => ({
      ...item,
      totalValue: (item.quantity * item.price).toFixed(2),
    }));

    const reportText = `
Stock Report for ${firstName} ${lastName}
Generated on: ${new Date().toLocaleString()}

Category: ${selectedCategory}
Total Inventory Value: $${filteredStock.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}

Detailed Stock List:
${report
  .map(
    (item) => `
  Item: ${item.name}
  Category: ${item.category}
  Quantity: ${item.quantity}
  Price: $${item.price.toFixed(2)}
  Total Value: $${item.totalValue}
`
  )
  .join('\n')}
    `;

    setReportData(reportText);
  };

  const downloadReport = () => {
    if (reportData) {
      const blob = new Blob([reportData], { type: 'text/plain' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `stock_report_${firstName}_${lastName}.txt`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Welcome to the Stock Management System</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => handleInputChange(e, 'firstName')}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => handleInputChange(e, 'lastName')}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Start Managing Stock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Stock Management System</h1>

      <input
        type="text"
        placeholder="Search items or categories..."
        value={searchTerm}
        onChange={(e) => handleInputChange(e, 'searchTerm')}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ddd' }}
      />

      <button
        onClick={openAddModal}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Add New Item
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Quantity</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stock
            .filter(
              (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <tr key={item.id}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>${item.price.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.category}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  <button
                    onClick={() => handleEditItem(item.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#FFA500',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '5px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#F44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        Total Inventory Value: ${stock.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
      </div>

      <label style={{ marginRight: '10px' }}>Generate report for:</label>
      <select value={selectedCategory} onChange={handleCategoryChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }}>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <button
        onClick={generateStockReport}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      >
        Generate Stock Report
      </button>

      {reportData && (
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
          {reportData}
        </div>
      )}

      {reportData && (
        <button
          onClick={downloadReport}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Download Report
        </button>
      )}

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => handleInputChange(e, 'name')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => handleInputChange(e, 'quantity')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => handleInputChange(e, 'price')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => handleInputChange(e, 'category')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleAddOrUpdateItem}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: editingId ? '#FFA500' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              {editingId ? 'Update Item' : 'Add New Item'}
            </button>
            <button
              onClick={closeModal}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<StockManagementApp />, document.getElementById('root'));
