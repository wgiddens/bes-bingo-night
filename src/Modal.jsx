// src/Modal.jsx
import React from 'react';
import './index.css';

function Modal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <div className="modal-buttons">
                    <button className="modal-btn confirm" onClick={onConfirm}>Confirm</button>
                    <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
