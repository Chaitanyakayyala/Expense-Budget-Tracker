import React, { useState } from 'react';

const Modal = ({ onClose, onSubmit }) => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");

  const handleClick = (e, type) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      const finalAmount = type === "earning" ? numericAmount : -numericAmount;
      const newdata = { id: Date.now(), date, amount: finalAmount, detail, type };
      if (onSubmit) onSubmit(newdata);
      setDate("");
      setAmount("");
      setDetail("");
      fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newdata)
      })
        .then(res => res.json())
        .then(data => setSubmittedData(prev => [...prev, data]));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>+ Add Transaction</h2>
        <form className="modal-form">
          <label>Budget Type</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="Select budget type" />

          <label>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />

          <label>Description</label>
          <input type="text" value={detail} onChange={e => setDetail(e.target.value)} placeholder="Enter description" />

          <div className="modal-actions">
            <button className="modal-btn" onClick={(e) => handleClick(e, "earning")}>Add Earning</button>
            <button className="modal-btn" onClick={(e) => handleClick(e, "expense")}>Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;