import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = ({ onAddWebsite }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <TopBar 
                    onAddWebsite={onAddWebsite} 
                    onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet/>
                    </div>
                </main>
            </div>
            
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
