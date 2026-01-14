import React, { useEffect, useState } from 'react';
import { getWebsites, deleteWebsite } from '../services/api';
// importing types removed
import { StatusCard } from '../components/StatusCard';
import { ArrowUp, ArrowDown, Activity, Clock } from 'lucide-react';

const DashboardPage = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
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
        const intervalId = setInterval(fetchData, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this monitor?')) {
            await deleteWebsite(id);
            fetchData();
        }
    };

    // Calculate Overview Stats
    const total = websites.length;
    const up = websites.filter(w => w.checks?.[0]?.status === 'UP').length;
    const down = websites.filter(w => w.checks?.[0]?.status === 'DOWN').length;
    const avgResponse = websites.reduce((acc, curr) => {
        const resp = curr.checks?.[0]?.response_time || 0;
        return acc + resp;
    }, 0) / (total || 1);

    return (
        <div className="space-y-8">
            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-400 font-medium">Total Monitors</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{total}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-400 font-medium">Systems Operational</p>
                        <h3 className="text-3xl font-bold text-green-500 mt-1">{up}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <ArrowUp className="w-6 h-6 text-green-500" />
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-400 font-medium">Active Incidents</p>
                        <h3 className="text-3xl font-bold text-red-500 mt-1">{down}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <ArrowDown className="w-6 h-6 text-red-500" />
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-400 font-medium">Avg. Response Time</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{Math.round(avgResponse)}ms</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Active Monitors</h2>
                    {/* Filter controls can go here */}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {websites.map((website) => (
                            <StatusCard
                                key={website.id}
                                website={website}
                                onDelete={(id) => handleDelete(id, { stopPropagation: () => { } })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
