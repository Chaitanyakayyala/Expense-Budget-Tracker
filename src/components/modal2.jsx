import React, { useState } from 'react';

const Modalnew = ({ onClose, onSubmit }) => {
  const [budgetType, setBudgetType] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newdata = { id: Date.now(), budgetType, amount };
    // To add a budget (call this when your budget form is submitted)
    
    if (onSubmit) onSubmit(newdata);
    setAmount("");
    setBudgetType("");
    fetch('http://localhost:3000/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { ...newdata, remaining: parseFloat(amount) } // Assuming remaining is the same as amount initially
      )
    })
      .then(res => res.json())
      .then(data => setSubmittedData1(prev => [...prev, data]));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>+ Add Budget</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Budget Name</label>
          <input type="text" value={budgetType} onChange={e => setBudgetType(e.target.value)} placeholder="Enter budget name" />

          <label>Total Budget</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter total budget" />

          <button type="submit" className="modal-btn full-width">Add</button>
        </form>
      </div>
    </div>
  );
};

export default Modalnew;
