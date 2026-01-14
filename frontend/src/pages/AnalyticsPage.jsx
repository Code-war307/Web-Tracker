import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, Activity, Calendar } from 'lucide-react';
import { getAnalyticsMetrics } from '../services/api';
import clsx from 'clsx';

const AnalyticsPage = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await getAnalyticsMetrics();
                setMetrics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [timeRange]);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading analytics...</div>;
    if (!metrics) return <div className="p-10 text-center">Failed to load analytics.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">System Analytics</h1>
                    <p className="text-gray-400">Performance metrics and historical trends</p>
                </div>
                
                {/* Time Range Selector */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 w-fit">
                    {['24h', '7d', '30d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                timeRange === range ? "bg-indigo-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Avg Response Time</span>
                        <Activity className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{Math.round(metrics.avgResponse)}ms</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                        <ArrowDown className="w-3 h-3" /> 12% vs last week
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Total Uptime</span>
                        <ArrowUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metrics.totalUptime}%</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" /> 0.2% vs last week
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Incidents</span>
                        <ArrowDown className="w-5 h-5 text-rose-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metrics.incidentCount}</div>
                    <div className="text-xs text-gray-500">In the selected period</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Response Time Trend */}
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Response Time Trend
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.trendData}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `${val}ms`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="avgLatency" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Uptime Bar Chart */}
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        Daily Uptime %
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[90, 100]} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="uptime" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
