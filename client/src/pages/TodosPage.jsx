import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TodosPage() {
    const [todos, setTodos] = useState([]);
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || { id: 1 }; 
    const currentUserId = loggedInUser.id;

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:3000/todos');
            if (!response.ok) throw new Error('Failed to fetch todos');
            const data = await response.json();
            const userTodos = data.filter(todo => todo.user_id === currentUserId);
            setTodos(userTodos);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodoDescription.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId,
                    description_todo: newTodoDescription
                })
            });

            if (!response.ok) throw new Error('Failed to add todo');
            fetchTodos();
            setNewTodoDescription('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleTodo = async (todoId, currentStatus, description) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_done: !currentStatus,
                    description_todo: description
                })
            });

            if (!response.ok) throw new Error('Failed to update todo');
            fetchTodos();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete todo');
            fetchTodos();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>My Todo List 📝</h1>
                <button 
                    onClick={() => navigate('/home')} 
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                    Back to Home 🏠
                </button>
            </div>
            
            {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

            <form onSubmit={handleAddTodo} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="What do you need to do today?"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '12px', border: 'none', color: '#333' }}
                />
                <button type="submit" style={{ padding: '12px 24px', cursor: 'pointer', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #27c5ff, #ff4db8)', color: 'white', fontWeight: '600' }}>
                    Add
                </button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {todos.map((todo) => (
                    <li 
                        key={todo.todo_id} 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '12px',
                            backgroundColor: todo.is_done ? '#e2fee2' : '#fff',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={todo.is_done}
                                onChange={() => handleToggleTodo(todo.todo_id, todo.is_done, todo.description_todo)}
                                style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
                            />
                            {/* צבע טקסט כהה באופן קבוע שלא ייעלם בגלל ה-CSS הגלובלי */}
                            <span style={{ textDecoration: todo.is_done ? 'line-through' : 'none', color: '#2c1466', fontSize: '16px', fontWeight: '500' }}>
                                {todo.description_todo}
                            </span>
                        </div>
                        <button 
                            onClick={() => handleDeleteTodo(todo.todo_id)}
                            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}
                        >
                            Delete 🗑️
                        </button>
                    </li>
                ))}
            </ul>
            {todos.length === 0 && <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: '20px' }}>No tasks for today. Enjoy! 😎</p>}
        </div>
    );
}

export default TodosPage;