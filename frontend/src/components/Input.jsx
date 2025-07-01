import React, { useState, useEffect } from "react";
import Modal from "./modal1";
import Modalnew from "./modal2";

const API_URL ="http://localhost:3000";
// const API_URL = "http://localhost:3000"; // Use this for local development if you have a local server running
const Input = () => {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [count, setCount] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [submittedData1, setSubmittedData1] = useState([]);
 

  const handledelete = (item) => {
   
    
   
    

    fetch(`${API_URL}/api/transactions/${item.id}`, { method: 'DELETE' })
      .then(() => {
        setSubmittedData(prev => prev.filter(t => t.id !== item.id));
        if (item.type === "expense" && item.date) {
  setSubmittedData1(prev =>
    prev.map(b =>
      b.budgetType === item.date
        ? { ...b, remaining: b.remaining + Math.abs(parseFloat(item.amount)) }
        : b
    )
  );
}
        setCount(prev =>
          item.type === "earning"
            ? prev - parseFloat(item.amount)
            : prev + Math.abs(parseFloat(item.amount))
        );
      });
  };

  const handledeletes = (item) => {
    
    // To delete a budget (call this when delete button is clicked)
    fetch(`${API_URL}/api/budgets/${item.id}`, { method: 'DELETE' })
      .then(() => setSubmittedData1(prev => prev.filter(b => b.id !== item.id)));
  };

  const refresh = () => {
    Promise.all([
      fetch(`${API_URL}/api/budgets`).then(res => res.json()),
      fetch(`${API_URL}/api/transactions`).then(res => res.json())
    ]).then(([budgets, transactions]) => {
      setSubmittedData1(
        budgets.map(budget => {
          const spent = transactions
            .filter(t => t.type === "expense" && t.date === budget.budgetType)
            .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);
          return {
            ...budget,
            remaining: budget.amount - spent
          };
        })
      );
      setSubmittedData(transactions);
      // Also update balance
      const balance = transactions.reduce((acc, t) =>
        t.type === "earning"
          ? acc + parseFloat(t.amount)
          : acc - Math.abs(parseFloat(t.amount)), 0);
      setCount(balance);
    });
  };

  // Call refresh on component mount (on every refresh)
  useEffect(() => {
    refresh();
  }, []);

  
  return (
    <div className="container">
      <header className="header">
        <h1 className="logo-heading">
          Expense Tracker
        </h1>
        <div className="button-row">
          <button onClick={() => setModal(true)} className="primary-btn">
            + Add Transaction
          </button>
          <button onClick={() => setModal1(true)} className="primary-btn">
            + Add Budget
          </button>
        </div>
      </header>

      <main className="main-section">
        <section className="transactions">
          <h2 className="balance-display">
            Your Balance - ₹{count}
          </h2>
          <h2>All Transactions</h2>
          {submittedData.map((item) => (
            
            <div
              style={{
                backgroundColor: item.type === "earning" ? "#dee9f3" : "#f4c9c9"
              }}
              className="card"
              key={item.id}
            >
              <div className="card-header">
                <div className="card-content">
                  <h3>{item.detail}</h3>
                  <p className="category">{item.date}</p>
                  <p className="amount red">₹{Math.abs(item.amount)}</p>
                </div>
                <button onClick={() => handledelete(item)} className="card-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="budgets">
          <h2>Budgets</h2>
          <div className="budget-grid">
            {submittedData1.map((item) => {
              const total = parseFloat(item.amount);
const remain = item.remaining !== undefined ? item.remaining : total;
const used = total - remain;
const percent = total === 0 ? 0 : (used / total) * 100;
              return (
               
                <div className="budget-card" key={item.id}>
                  <div className="budget-title">{item.budgetType}</div>
                  <div className="budget-amounts">
                    Total Budget <strong>₹{total}</strong>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${(used / total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="budget-amounts">
                    Remaining <strong>₹{remain}</strong>
                  </div>
                  <button onClick={() => handledeletes(item)} className="card-delete">
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {modal && (
        <Modal
          onClose={() => setModal(false)}
          onSubmit={(data) => {
            setSubmittedData((prev) => [...prev, data]);
            setCount((prev) => prev + parseFloat(data.amount));
           
            if (data.type === "expense" && data.date) {
              setSubmittedData1(prev =>
                prev.map(b =>
                  b.budgetType === data.date
                    ? { ...b, remaining: (b.remaining !== undefined ? b.remaining : parseFloat(b.amount)) - Math.abs(parseFloat(data.amount)) }
                    : b
                )
              );
            }
            setModal(false);
            
          }}
        />
      )}

      {modal1 && (
        <Modalnew
          onClose={() => setModal1(false)}
          onSubmit={(data) => {
            setSubmittedData1((prev) => [...prev, { ...data, remaining: parseFloat(data.amount) }]);
            setModal1(false);
            
          }}
        />
      )}
    </div>
  );
};

export default Input;
