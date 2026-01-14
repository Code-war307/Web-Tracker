import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Activity, Pause, Trash2 } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getWebsiteById, deleteWebsite } from '../services/api';
import { format } from 'date-fns';
import clsx from 'clsx';

const WebsiteDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [website, setWebsite] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        try {
            const data = await getWebsiteById(id);
            setWebsite(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000); // 2s poll for realtime chart
        return () => clearInterval(interval);
    }, [id]);

    const handleDelete = async () => {
        if (confirm('Delete this monitor?')) {
            await deleteWebsite(id);
            navigate('/');
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading analytics...</div>;
    if (!website) return <div className="p-10 text-center">Monitor not found.</div>;

    // Prepare Chart Data (reverse so oldest is left)
    const chartData = [...(website.checks || [])].reverse().map(c => ({
        time: format(new Date(c.checked_at), 'HH:mm'),
        latency: c.response_time,
        status: c.status
    }));

    // Uptime Calculation (Simple)
    const totalChecks = website.checks?.length || 0;
    const upChecks = website.checks?.filter(c => c.status === 'UP').length || 0;
    const uptime = totalChecks > 0 ? ((upChecks / totalChecks) * 100).toFixed(2) : '100';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{website.name}</h1>
                        <a href={website.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                            {website.url}
                        </a>
                    </div>
                    {/* Status Badge */}
                    <div className={clsx(
                        "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ml-4",
                        website.checks?.[0]?.status === 'UP' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                    )}>
                        <div className={clsx("w-2 h-2 rounded-full animate-pulse", website.checks?.[0]?.status === 'UP' ? 'bg-emerald-500' : 'bg-rose-500')} />
                        {website.checks?.[0]?.status || 'UNKNOWN'}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2 transition-colors">
                        <Pause className="w-4 h-4" /> Pause
                    </button>
                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center gap-2 transition-colors border border-rose-500/20">
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Uptime (24h)</p>
                    <div className="text-3xl font-bold text-emerald-400">{uptime}%</div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Avg Latency</p>
                    <div className="text-3xl font-bold text-blue-400">
                        {Math.round(chartData.reduce((acc, c) => acc + c.latency, 0) / (chartData.length || 1))}ms
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Last Checked</p>
                    <div className="text-xl font-mono text-gray-200">
                        {website.checks?.[0] ? format(new Date(website.checks[0].checked_at), 'HH:mm:ss') : '-'}
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Check Interval</p>
                    <div className="text-xl font-mono text-gray-200">{website.check_interval}s</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Response Time Chart */}
                <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Response Time History
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}ms`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="latency"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorLatency)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Real-time Minute Tracker (Heatmap style) */}
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        Uptime Tracker (Last 60 checks)
                    </h3>
                    <div className="flex flex-wrap gap-1">
                        {/* Show last 60 checks as blocks */}
                        {Array.from({ length: 60 }).map((_, i) => {
                            const check = website.checks?.[i];
                            const status = check?.status || 'UNKNOWN';
                            let color = 'bg-gray-800';
                            if (status === 'UP') color = 'bg-emerald-500';
                            if (status === 'SLOW') color = 'bg-yellow-500';
                            if (status === 'DOWN') color = 'bg-rose-500';

                            return (
                                <div
                                    key={i}
                                    className={clsx("w-3 h-8 rounded-sm transition-all hover:scale-125", color)}
                                    title={check ? `${format(new Date(check.checked_at), 'HH:mm:ss')} - ${check.response_time}ms` : 'No Data'}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Operational</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full" /> Downtime</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-800 rounded-full" /> No Data</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteDetailsPage;
