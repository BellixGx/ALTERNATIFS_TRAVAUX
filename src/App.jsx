import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import './App.css';
import { Refine } from "@refinedev/core";
import IdleTimeoutWrapper from './wrappers/IdleTimeoutWrapper';
// Client Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

// Admin Pages
import AdminAuth from './supersecret-admin-panel-a/auth/login';
import ForgotPassword from './supersecret-admin-panel-a/auth/forgotPassword';
import AdminDashboard from './supersecret-admin-panel-a/pages/AdminDash';
import AdminSettings from './supersecret-admin-panel-a/pages/AdminReports';
import AdminArticles from './supersecret-admin-panel-a/pages/AdminArticles';
import AdminProjects from './supersecret-admin-panel-a/pages/AdminProjects';
import AdminReports from './supersecret-admin-panel-a/pages/AdminReports';
import AdminEmployees from './supersecret-admin-panel-a/pages/AdminEmployees';
import ProtectedRoute from './supersecret-admin-panel-a/components/ProtectedRoute';

import 'antd/dist/reset.css';
import { authProvider } from "./authProvider";
const App = () => {

    return (
        <BrowserRouter>
        <Refine authProvider={authProvider}>
            <IdleTimeoutWrapper>
                {/* Client Routes */}
                <Routes>
                    <Route path="/" element={<ClientLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="contact" element={<Contact />} />
                    </Route>
            
                    {/* Admin Routes */}
                    <Route path="/login" element={<AdminAuth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
            
                    {/* Protected Routes wrapped with ProtectedRoute */}
                    <Route element={<ProtectedRoute />}> {/* Wrap the entire route group */}
                    <Route path="/supersecret-admin-panel-a" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="articles" element={<AdminArticles />} />
                        <Route path="projects" element={<AdminProjects />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="employees" element={<AdminEmployees />} />
                    </Route>
                    </Route>
                </Routes>
          </IdleTimeoutWrapper>
        </Refine>
      </BrowserRouter>
      
    );
};

export default App;
