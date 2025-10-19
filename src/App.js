import React, { useState } from "react";
import Modal from "./Modal";
import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app-container">
      <button className="save-segment-btn" onClick={() => setShowModal(true)}>
        Save segment
      </button>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;
