import React , {useState} from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from '../Card/Card';
import AddModal from '../Modal/AddModal';

const Column = ({ id, title, tasks, taskCount, color ,  onAddCard, onDeleteCard}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const taskIds = tasks.map(task => task.id);

    const handleAddCard = (taskTitle) => {
        onAddCard(id, taskTitle);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="column" style={{ '--column-color': color }}>
                <div className="column-header">
                <div className="column-title">
                    <span>{title}</span>
                    <span className="task-count">{taskCount}</span>
                </div>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>+</button>
                </div>
                <button className="add-card-btn" onClick={() => setIsModalOpen(true)}>+ Add Card</button>
                <div className="column-content">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <Card key={task.id} id={task.id} title={task.title} onDelete={() => onDeleteCard(id, task.id)}/>
                    ))}
                </SortableContext>
                </div>
            </div>

            <AddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddCard}
                columnTitle={title}
            />
        </>
    )
}

export default Column