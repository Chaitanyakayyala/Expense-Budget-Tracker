import React, { useState } from 'react';

const Modalnew = ({ onClose, onSubmit }) => {
  const [budgetType, setBudgetType] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newdata = { id: Date.now(), budgetType, amount };
    if (onSubmit) onSubmit(newdata);
    setAmount("");
    setBudgetType("");
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
