import React, { useState } from "react";
import Modal from "./modal1";
import Modalnew from "./modal2";

const Input = () => {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [count, setCount] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [submittedData1, setSubmittedData1] = useState([]);
 

  const handledelete = (item) => {
    let copytask = [...submittedData];
    copytask = copytask.filter((task) => task.id !== item.id);
    setSubmittedData(copytask);
    setCount((prev) => prev - parseFloat(item.amount));
    
    if (item.type === "expense" && item.date) {
      setSubmittedData1(prev => prev.map(b =>
        b.budgetType === item.date
          ? { ...b, remaining: (b.remaining !== undefined ? b.remaining : parseFloat(b.amount)) + Math.abs(parseFloat(item.amount)) }
          : b
      ));
    }
  };

  const handledeletes = (item) => {
    let copytask = [...submittedData1];
    copytask = copytask.filter((task) => task.id !== item.id);
    setSubmittedData1(copytask);
  };

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
              setSubmittedData1(prev => prev.map(b =>
                b.budgetType === data.date
                  ? { ...b, remaining: (b.remaining !== undefined ? b.remaining : parseFloat(b.amount)) - Math.abs(parseFloat(data.amount)) }
                  : b
              ));
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
