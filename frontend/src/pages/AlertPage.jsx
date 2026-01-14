import { useEffect, useState } from 'react';
import { AlertCircle, Search, Filter, CheckCircle2, Clock } from 'lucide-react';
import { getAlerts } from '../services/api';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const AlertPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, RESOLVED
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadAlerts = async () => {
            setLoading(true);
            try {
                const data = await getAlerts();
                setAlerts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadAlerts();
    }, []);

    const filteredAlerts = alerts
        .filter(a => {
            if (filter === 'ALL') return true;
            if (filter === 'ACTIVE') return a.status !== 'UP' && a.status !== 'RESOLVED';
            if (filter === 'RESOLVED') return a.status === 'UP' || a.status === 'RESOLVED';
            return true;
        })
        .filter(a => a.websiteName.toLowerCase().includes(search.toLowerCase()) || a.message.toLowerCase().includes(search.toLowerCase()));

    const getSeverityColor = (status) => {
        if (status === 'DOWN') return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (status === 'SLOW') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Alerts & Incidents</h1>
                    <p className="text-gray-400">Manage and track system anomalies</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                        Configure Alerts
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search alerts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
                <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                    {['ALL', 'ACTIVE', 'RESOLVED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                                filter === f ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 animate-pulse">Loading alerts...</div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border border-white/5">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white">No alerts found</h3>
                        <p className="text-gray-500">Everything is running smoothly.</p>
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <div key={alert.id} className="glass p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0", 
                                        alert.status === 'DOWN' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                                    )}>
                                        <AlertCircle className={clsx("w-5 h-5", 
                                            alert.status === 'DOWN' ? 'text-red-500' : 'text-yellow-500'
                                        )} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white flex items-center gap-2">
                                            {alert.websiteName}
                                            <span className={clsx("px-2 py-0.5 rounded text-[10px] uppercase font-bold border", getSeverityColor(alert.status))}>
                                                {alert.status}
                                            </span>
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1">{alert.message}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Started {formatDistanceToNow(new Date(alert.time), { addSuffix: true })}
                                            </span>
                                            <span>Duration: {alert.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors opacity-0 group-hover:opacity-100">
                                    Acknowledge
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertPage;
