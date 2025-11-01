import React, { useState } from 'react';
import type { User, Role, BusRoute, Vehicle, TransportAlert } from '../../types';
import { 
    ArrowLeftOnRectangleIcon, 
    TruckIcon,
    MapIcon,
    BellIcon,
    Cog8ToothIcon,
    ChartPieIcon
} from '../Icons';
import { mockRoutes, mockVehicles, mockTransportAlerts } from '../../data/mockData';

// --- Sub-components for different views ---

const OverviewTab: React.FC<{ routes: BusRoute[]; vehicles: Vehicle[] }> = ({ routes, vehicles }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Routes" value={routes.length} icon={<MapIcon className="w-6 h-6"/>} />
        <StatCard title="Vehicles in Service" value={vehicles.filter(v => v.status === 'Active').length} icon={<TruckIcon className="w-6 h-6"/>} />
        <StatCard title="Maintenance Due" value={vehicles.filter(v => v.status === 'Under Maintenance').length} icon={<Cog8ToothIcon className="w-6 h-6"/>} />
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/60 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/80 flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);


const RouteManagementTab: React.FC<{ routes: BusRoute[]; vehicles: Vehicle[] }> = ({ routes, vehicles }) => {
    const getVehicleNumber = (vehicleId: string) => vehicles.find(v => v.id === vehicleId)?.vehicleNumber || 'N/A';
    
    return (
        <div className="space-y-4">
            {routes.map(route => (
                <div key={route.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b dark:border-slate-600 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">{route.routeName} ({route.routeNumber})</h3>
                            <p className="text-sm text-slate-500">Vehicle: {getVehicleNumber(route.vehicleId)}</p>
                        </div>
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">Manage</button>
                    </div>
                    <div className="p-4">
                        <h4 className="font-semibold text-sm mb-2">Stops:</h4>
                        <ul className="space-y-2">
                            {route.stops.map(stop => (
                                <li key={stop.id} className="flex justify-between text-sm p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                    <span>{stop.name}</span>
                                    <span>Pickup: {stop.pickupTime} / Dropoff: {stop.dropoffTime}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

const VehicleManagementTab: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                    <th scope="col" className="px-6 py-3">Vehicle #</th>
                    <th scope="col" className="px-6 py-3">Model</th>
                    <th scope="col" className="px-6 py-3">Driver</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Next Service</th>
                </tr>
            </thead>
            <tbody>
                {vehicles.map(vehicle => (
                    <tr key={vehicle.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{vehicle.vehicleNumber}</td>
                        <td className="px-6 py-4">{vehicle.model}</td>
                        <td className="px-6 py-4">{vehicle.driverName}</td>
                        <td className="px-6 py-4">{vehicle.status}</td>
                        <td className="px-6 py-4">{vehicle.nextServiceDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AlertsTab: React.FC<{ alerts: TransportAlert[], routes: BusRoute[] }> = ({ alerts, routes }) => {
    const [message, setMessage] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(routes[0]?.id || '');

    const handleSend = () => {
        if (!message || !selectedRoute) return;
        alert(`Alert for Route ${routes.find(r=>r.id === selectedRoute)?.routeName} sent: "${message}"`);
        setMessage('');
    };

    return (
        <div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 mb-6">
                <h3 className="font-bold mb-2">Send New Alert</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)} className="md:col-span-1 bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600">
                        {routes.map(r => <option key={r.id} value={r.id}>{r.routeName}</option>)}
                    </select>
                    <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter alert message..." className="md:col-span-2 bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600"/>
                </div>
                <button onClick={handleSend} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold">Send Alert</button>
            </div>
            <h3 className="font-bold mb-2">Recent Alerts</h3>
            <div className="space-y-2">
                {alerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                        <strong>{routes.find(r=>r.id === alert.routeId)?.routeName}:</strong> {alert.message}
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---

type TransportDashboardView = 'dashboard' | 'routes' | 'vehicles' | 'alerts' | 'settings';

const NavItem: React.FC<{
    viewName: TransportDashboardView;
    activeView: TransportDashboardView;
    setView: (view: TransportDashboardView) => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ viewName, activeView, setView, icon, children }) => {
    const isActive = activeView === viewName;
    return (
        <li>
            <a href="#" onClick={(e) => { e.preventDefault(); setView(viewName); }}
                className={`flex items-center p-3 text-base font-medium rounded-lg transition-colors duration-200 group ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}>
                {icon}
                <span className="ml-3 flex-1 whitespace-nowrap">{children}</span>
            </a>
        </li>
    );
};

interface TransportDashboardPageProps {
    user: User;
    role: Role;
    onLogout: () => void;
    onBackToRoles: () => void;
}

export const TransportDashboardPage: React.FC<TransportDashboardPageProps> = ({ user, role, onLogout, onBackToRoles }) => {
    const [currentView, setCurrentView] = useState<TransportDashboardView>('dashboard');
    
    // In a real app, this data would be fetched
    const [routes, setRoutes] = useState<BusRoute[]>(mockRoutes);
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [alerts, setAlerts] = useState<TransportAlert[]>(mockTransportAlerts);

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <OverviewTab routes={routes} vehicles={vehicles} />;
            case 'routes': return <RouteManagementTab routes={routes} vehicles={vehicles} />;
            case 'vehicles': return <VehicleManagementTab vehicles={vehicles} />;
            case 'alerts': return <AlertsTab alerts={alerts} routes={routes}/>;
            case 'settings':
            default:
                return <div className="p-8 text-center"><h2 className="text-2xl font-bold">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2><p className="mt-2 text-slate-500">This feature is coming soon!</p></div>;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 px-3 py-2 mb-6">
                        <TruckIcon className="h-8 w-8 text-blue-500"/>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">Transport</span>
                    </div>
                    <ul className="space-y-2">
                        <NavItem viewName="dashboard" activeView={currentView} setView={setCurrentView} icon={<ChartPieIcon className="w-6 h-6"/>}>Dashboard</NavItem>
                        <NavItem viewName="routes" activeView={currentView} setView={setCurrentView} icon={<MapIcon className="w-6 h-6"/>}>Route Management</NavItem>
                        <NavItem viewName="vehicles" activeView={currentView} setView={setCurrentView} icon={<TruckIcon className="w-6 h-6"/>}>Vehicle Fleet</NavItem>
                        <NavItem viewName="alerts" activeView={currentView} setView={setCurrentView} icon={<BellIcon className="w-6 h-6"/>}>Send Alerts</NavItem>
                    </ul>
                </div>
                <ul className="space-y-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <NavItem viewName="settings" activeView={currentView} setView={setCurrentView} icon={<Cog8ToothIcon className="w-6 h-6"/>}>Settings</NavItem>
                </ul>
            </aside>

            <main className="flex-1 p-6">
                 <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transport Dashboard</h1>
                        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Welcome, {user.user_metadata?.fullName || 'Transport Staff'}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onBackToRoles} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:underline">Change Role</button>
                        <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-200 dark:bg-slate-700 rounded-lg">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5"/> Logout
                        </button>
                    </div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
};