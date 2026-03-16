'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Search, LogOut, CheckCircle2, Circle, Edit2, Trash2, Loader2 } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '' });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            fetchTasks();
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        let filtered = tasks;

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((task) => task.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTasks(filtered);
    }, [tasks, statusFilter, searchQuery]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        try {
            await api.post('/tasks', { ...formData, status: 'OPEN' });
            setShowModal(false);
            setFormData({ title: '', description: '' });
            fetchTasks();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const handleUpdateTask = async () => {
        if (!editingTask) return;
        try {
            await api.patch(`/tasks/${editingTask.id}`, formData);
            setShowModal(false);
            setEditingTask(null);
            setFormData({ title: '', description: '' });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    const handleToggleStatus = async (task: Task) => {
        try {
            const newStatus = task.status === 'OPEN' ? 'DONE' : 'OPEN';
            await api.patch(`/tasks/${task.id}`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error('Failed to toggle task', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setFormData({ title: '', description: '' });
        setShowModal(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setFormData({ title: task.title, description: task.description || '' });
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Task Manager</h1>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="ALL">All Tasks</option>
                        <option value="OPEN">Open</option>
                        <option value="DONE">Done</option>
                    </select>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <button
                                    onClick={() => handleToggleStatus(task)}
                                    className="flex-shrink-0"
                                >
                                    {task.status === 'DONE' ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-white/40" />
                                    )}
                                </button>
                                <div className="flex gap-2 ml-auto">
                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4 text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>

                            <h3 className={`text-lg font-semibold mb-2 ${task.status === 'DONE' ? 'text-white/60 line-through' : 'text-white'}`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className="text-white/70 text-sm mb-4">{task.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-white/50">
                                <span className={`px-2 py-1 rounded ${task.status === 'DONE' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                    {task.status}
                                </span>
                                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTasks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/60 text-lg">No tasks found</p>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Task title"
                                />
                            </div>

                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                                    placeholder="Task description (optional)"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingTask ? handleUpdateTask : handleCreateTask}
                                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                            >
                                {editingTask ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
