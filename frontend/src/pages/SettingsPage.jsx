import { useEffect, useState } from 'react';
import { Save, Bell, Smartphone, Slack, Moon, Sun, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getSettings, updateSettings } from '../services/api';
import clsx from 'clsx';

const SettingsPage = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(settings);
            setMessage({ type: 'success', text: 'Settings saved successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const toggleNotification = (type) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading settings...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-400">Manage your workspace preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            {message && (
                <div className={clsx(
                    "p-4 rounded-xl border flex items-center gap-2 animate-in slide-in-from-top-2",
                    message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                    <CheckCircle2 className="w-5 h-5" />
                    {message.text}
                </div>
            )}

            {/* General Settings */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-semibold border-b border-white/5 pb-4">General Preferences</h2>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white flex items-center gap-2">Theme</h3>
                        <p className="text-sm text-gray-400">Choose your interface appearance</p>
                    </div>
                    <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setSettings({ ...settings, theme: 'light' })}
                            className={clsx("p-2 rounded-md transition-all", settings.theme === 'light' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white")}
                        >
                            <Sun className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, theme: 'dark' })}
                            className={clsx("p-2 rounded-md transition-all", settings.theme === 'dark' ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white")}
                        >
                            <Moon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white">Dashboard Refresh Rate</h3>
                        <p className="text-sm text-gray-400">How often to fetch new data</p>
                    </div>
                    <select
                        value={settings.refreshInterval}
                        onChange={(e) => setSettings({ ...settings, refreshInterval: Number(e.target.value) })}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                    >
                        <option value={10}>10 Seconds</option>
                        <option value={30}>30 Seconds</option>
                        <option value={60}>1 Minute</option>
                        <option value={300}>5 Minutes</option>
                    </select>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-semibold border-b border-white/5 pb-4">Notifications</h2>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Email Alerts</h3>
                            <p className="text-sm text-gray-400">Receive downtime alerts via email</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.notifications.email}
                            onChange={() => toggleNotification('email')}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Slack className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Slack Integration</h3>
                            <p className="text-sm text-gray-400">Post incidents to a Slack channel</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.notifications.slack}
                            onChange={() => toggleNotification('slack')}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">SMS Notifications</h3>
                            <p className="text-sm text-gray-400">Urgent alerts to your phone</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.notifications.sms}
                            onChange={() => toggleNotification('sms')}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
