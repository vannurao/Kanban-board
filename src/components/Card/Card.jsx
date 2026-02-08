import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Card = ({ id, title , onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = (e) => {
        e.stopPropagation(); 
        onDelete();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task-card"
        >
            <div className="task-content">
                <span>{title}</span>
                <button className="delete-btn" onClick={handleDelete}>
                    <img src='./delete.png' width={'30px'} height={'30px'}/>
                </button>
            </div>
            <div className="task-footer">
                <div className="task-indicator"></div>
            </div>
        </div>
    )
}

export default Card;