import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const SCHEMAS = [
  { label: "First Name", value: "first_name", type: "user" },
  { label: "Last Name", value: "last_name", type: "user" },
  { label: "Gender", value: "gender", type: "user" },
  { label: "Age", value: "age", type: "user" },
  { label: "Account Name", value: "account_name", type: "group" },
  { label: "City", value: "city", type: "group" },
  { label: "State", value: "state", type: "group" },
];

export default function Modal({ onClose }) {
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState("");

  const handleAddSchema = () => {
    if (currentSchema && !selectedSchemas.includes(currentSchema)) {
      setSelectedSchemas([...selectedSchemas, currentSchema]);
      setCurrentSchema("");
    }
  };

  const handleRemove = (value) => {
    setSelectedSchemas(selectedSchemas.filter((s) => s !== value));
  };

  const handleSave = async () => {
    if (segmentName.trim() === "" || selectedSchemas.length === 0) {
      toast.error("Segment name and at least one schema are required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const schemaData = selectedSchemas.map((val) => {
      const label = SCHEMAS.find((s) => s.value === val)?.label;
      return { [val]: label };
    });

    const payload = {
      segment_name: segmentName,
      schema: schemaData,
    };


    const WEBHOOK_URL = "https://webhook.site/your-custom-url";

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("✅ Segment saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setSegmentName("");
      setSelectedSchemas([]);
      setCurrentSchema("");
    } catch (error) {
      toast.error("❌ Failed to save the segment. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const availableOptions = SCHEMAS.filter(
    (s) => !selectedSchemas.includes(s.value)
  );

  return (
    <>
      <div className="modal-overlay">
        <div className="side-modal">
          <div className="modal-header">
            <button className="back-arrow" onClick={onClose}>
              ←
            </button>
            <h3>Saving Segment</h3>
          </div>
          <div className="modal-body">
            <label>Enter the Name of the Segment</label>
            <input
              type="text"
              placeholder="Name of the segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            <p className="info-text">
              To save your segment, you need to add the schemas to build the query
            </p>
            <div className="trait-legend">
              <span>
                <span className="dot user"></span> - User Traits
              </span>
              <span>
                <span className="dot group"></span> - Group Traits
              </span>
            </div>
            {selectedSchemas.length > 0 && 
            <div className="schema-box">
              {selectedSchemas.map((val, idx) => {
                const item = SCHEMAS.find((s) => s.value === val);
                const dropdownOptions = SCHEMAS.filter(
                  (s) =>
                    !selectedSchemas.includes(s.value) || s.value === val
                );

                return (
                  <div className="schema-row" key={idx}>
                    <span
                      className={`dot ${
                        item?.type === "user" ? "user" : "group"
                      }`}
                    ></span>
                    <select
                      value={val}
                      onChange={(e) => {
                        const updated = [...selectedSchemas];
                        updated[idx] = e.target.value;
                        setSelectedSchemas(updated);
                      }}
                    >
                      {dropdownOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(val)}
                    >
                      -
                    </button>
                  </div>
                );
              })}
            </div>
            }
            <div className="schema-row">
              <span className="dot neutral"></span>
              <select
                value={currentSchema}
                onChange={(e) => setCurrentSchema(e.target.value)}
              >
                <option value="">Add schema to segment</option>
                {availableOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button className="remove-btn" disabled>
                -
              </button>
            </div>
            <button className="add-link" onClick={handleAddSchema}>
              + Add new schema
            </button>
          </div>
          <div className="modal-footer">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={segmentName.trim() === "" || selectedSchemas.length === 0}
            >
              Save the Segment
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
