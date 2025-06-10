import React, { useState } from 'react';

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.name);

  const handleToggleDone = () => {
    onUpdate({
      ...task,
      done: !task.done
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedText.trim() !== '') {
      onUpdate({
        ...task,
        name: editedText
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(task.name);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.done ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
          />
          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="btn btn-save">Save</button>
            <button onClick={handleCancelEdit} className="btn btn-cancel">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.done}
              onChange={handleToggleDone}
            />
            <span className={`task-text ${task.done ? 'completed-text' : ''}`}>
              {task.name}
            </span>
          </div>
          <div className="task-actions">
            <button onClick={handleEditClick} className="btn btn-edit">Edit</button>
            <button onClick={() => onDelete(task.id)} className="btn btn-delete">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;