import React, { useState } from 'react';
import AdminSidebar from '../supersecret-admin-panel-a/components/AdminSidebar';
import { Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content */}
            <main className={`content-area ${collapsed ? 'collapsed' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
