import React , {useState} from 'react'
import './style.css'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from '../column/Column';

const KanbanBoard = () => {
    const [columns, setColumns] = useState({
        todo: {
            id: 'todo',
            title: 'Todo',
            color: '#2196F3',
            tasks: [
                { id: 'task-1', title: 'Create initial project plan', columnId: 'todo' },
                { id: 'task-2', title: 'Design landing page', columnId: 'todo' },
                { id: 'task-3', title: 'Review codebase structure', columnId: 'todo' },
            ],
        },
        inProgress: {
            id: 'inProgress',
            title: 'In Progress',
            color: '#FF9800',
            tasks: [
                { id: 'task-4', title: 'Implement authentication', columnId: 'inProgress' },
                { id: 'task-5', title: 'Set up database schema', columnId: 'inProgress' },
                { id: 'task-6', title: 'Fix navbar bugs', columnId: 'inProgress' },
            ],
        },
        done: {
            id: 'done',
            title: 'Done',
            color: '#4CAF50',
            tasks: [
                { id: 'task-7', title: 'Organize project repository', columnId: 'done' },
                { id: 'task-8', title: 'Write API documentation', columnId: 'done' },
            ],
        },
    });

    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const findContainer = (id) => {
        if (id in columns) {
            return id;
        }
        return Object.keys(columns).find((key) =>
            columns[key].tasks.some((task) => task.id === id)
        );
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setColumns((prev) => {
            const activeItems = prev[activeContainer].tasks;
            const overItems = prev[overContainer].tasks;

            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.findIndex((item) => item.id === over.id);

            let newIndex;
            if (over.id in prev) {
                newIndex = overItems.length;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
            }

            return {
                ...prev,
                [activeContainer]: {
                    ...prev[activeContainer],
                    tasks: prev[activeContainer].tasks.filter((item) => item.id !== active.id),
                },
                [overContainer]: {
                    ...prev[overContainer],
                    tasks: [
                        ...prev[overContainer].tasks.slice(0, newIndex),
                        { ...activeItems[activeIndex], columnId: overContainer },
                        ...prev[overContainer].tasks.slice(newIndex),
                    ],
                },
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) {
            setActiveId(null);
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer) {
            setActiveId(null);
            return;
        }

        if (activeContainer === overContainer) {
            const activeIndex = columns[activeContainer].tasks.findIndex(
                (task) => task.id === active.id
            );
            const overIndex = columns[overContainer].tasks.findIndex(
                (task) => task.id === over.id
            );

            if (activeIndex !== overIndex) {
                setColumns((prev) => ({
                    ...prev,
                    [overContainer]: {
                        ...prev[overContainer],
                        tasks: arrayMove(prev[overContainer].tasks, activeIndex, overIndex),
                    },
                }));
            }
        }

        setActiveId(null);
    };

    const activeTask = activeId
        ? Object.values(columns)
            .flatMap((col) => col.tasks)
            .find((task) => task.id === activeId)
        : null;

    const handleAddCard = (columnId, title) => {
        const newTask = {
            id: `task-${Date.now()}`,
            title: title,
            columnId: columnId,
        };

        setColumns((prev) => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                tasks: [...prev[columnId].tasks, newTask],
            },
        }));
    };

    const handleDeleteCard = (columnId, taskId) => {
        setColumns((prev) => ({
        ...prev,
            [columnId]: {
                ...prev[columnId],
                tasks: prev[columnId].tasks.filter((task) => task.id !== taskId),
            },
        }));
    };

    return (
        <div className="kanban-container">
            <h1 className="kanban-title">My Tasks</h1>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-board">
                    {Object.values(columns).map((column) => (
                        <Column
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={column.tasks}
                            taskCount={column.tasks.length}
                            color={column.color}
                            onAddCard={handleAddCard}
                            onDeleteCard={handleDeleteCard}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask ? (
                        <div className="task-card task-card-overlay">
                            <div className="task-content">
                                <span>{activeTask.title}</span>
                                <button className="delete-btn">
                                    <img src='./delete.png' alt='delete' width={'30px'} height={'30px'}/>
                                </button>
                            </div>
                            <div className="task-footer">
                                <div className="task-indicator"></div>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default KanbanBoard;
