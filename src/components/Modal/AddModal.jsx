import React, { useState, useEffect } from 'react';

const AddModal = ({ isOpen, onClose, onAdd, columnTitle }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Card to {columnTitle}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label htmlFor="card-title">Card Title</label>
            <input
              id="card-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter card title..."
              autoFocus
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add" disabled={!title.trim()}>
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;