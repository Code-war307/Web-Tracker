import { Bell, Search, Plus, Menu } from 'lucide-react';

const TopBar = ({ onAddWebsite, onMenuToggle }) => {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={onMenuToggle}
                    className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 md:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                {/* Search Bar */}
                <div className="relative w-full max-w-[200px] md:max-w-[300px] group hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder="Search websites, incidents..."
                        className="w-full bg-muted/30 border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:bg-background focus:border-border transition-all outline-none placeholder:text-muted-foreground/70"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-500">System Healthy</span>
                </div>

                <div className="h-6 w-px bg-border mx-2" />

                <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
                </button>

                <button
                    onClick={onAddWebsite}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Monitor</span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
