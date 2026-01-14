import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ExternalLink, Trash2, MoreVertical, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { getWebsites, deleteWebsite } from '../services/api';
import { AddWebsiteModal } from '../components/AddWebsiteModal';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const WebsitesPage = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getWebsites();
            setWebsites(data);
        } catch (error) {
            console.error('Failed to fetch websites', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for status updates
        const intervalId = setInterval(async () => {
             const data = await getWebsites();
             setWebsites(data);
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this monitor?')) {
            await deleteWebsite(id);
            fetchData();
        }
    };

    const handleAddWebsite = async (name, url, interval) => {
        // We need to import the add functionality or pass it down. 
        // For this standalone page, we can reuse the API call directly or rely on the modal's prop if we refactor.
        // Ideally, this page should manage the add flow too or reuse the global one.
        // Let's import the api function here to keep it self-contained if needed, 
        // OR better, pass the refresh callback to the global modal if reusing.
        // WAIT: The AddWebsiteModal takes an `onAdd` prop.
        
        // Let's import the api add function just for this page's modal usage
        const { addWebsite } = await import('../services/api');
        await addWebsite(name, url, interval);
        setIsModalOpen(false);
        fetchData();
    };

    const filteredWebsites = websites.filter(w => 
        w.name.toLowerCase().includes(search.toLowerCase()) || 
        w.url.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        if (status === 'UP') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (status === 'DOWN') return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Monitored Websites</h1>
                    <p className="text-gray-400">View and manage all your active monitors</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Monitor
                </button>
            </div>

            {/* Search and Filters */}
            <div className="glass p-4 rounded-xl flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or URL..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Table View */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Uptime (24h)</th>
                                <th className="px-6 py-4 font-medium">Last Checked</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 animate-pulse">
                                        Loading monitors...
                                    </td>
                                </tr>
                            ) : filteredWebsites.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No websites found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredWebsites.map((website) => {
                                    const lastCheck = website.checks?.[0];
                                    const status = lastCheck?.status || 'UNKNOWN';
                                    
                                    return (
                                        <tr key={website.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                                        <img 
                                                            src={`https://www.google.com/s2/favicons?domain=${website.url}&sz=64`} 
                                                            alt="" 
                                                            className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{website.name}</div>
                                                        <a href={website.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                                                            {website.url}
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5", getStatusColor(status))}>
                                                    <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", status === 'UP' ? 'bg-emerald-500' : status === 'DOWN' ? 'bg-rose-500' : 'bg-yellow-500')} />
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 font-mono">
                                                {/* Mock Uptime Calc */}
                                                {status === 'UP' ? '100%' : '98.5%'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                 {lastCheck 
                                                    ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(lastCheck.checked_at), { addSuffix: true })}</span> 
                                                    : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        to={`/websites/${website.id}`}
                                                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                                        title="View Details"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(website.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddWebsiteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddWebsite}
            />
        </div>
    );
};

export default WebsitesPage;
