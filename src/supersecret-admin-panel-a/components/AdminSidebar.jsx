import React, { useEffect } from 'react';
import { Layout, Button, Tooltip, theme } from 'antd';
import { NavLink } from 'react-router-dom';
import {
  AreaChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
  ContainerOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '../../../src/authProvider';
import './SideBar.css';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { Sider, Header } = Layout;
  const { token: { colorBgContainer } } = theme.useToken();

  // Set collapsed to true on component mount
  useEffect(() => {
    setCollapsed(true); // Collapse the sidebar by default
  }, [setCollapsed]); // Run once on mount

  // Existing useEffect for mobile responsiveness
  useEffect(() => {
    if (window.innerWidth <= 480) {
      setCollapsed(true);
    }
  }, [setCollapsed]);

  const handleLinkClick = () => {
    if (window.innerWidth <= 480) {
      setCollapsed(true);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    authProvider.logout();
    navigate('/login');
  };

  return (
    <Sider
      collapsed={collapsed}
      collapsible
      trigger={null}
      className="sidebar"
      style={{
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        style={{
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          alignItems: 'center',
          background: colorBgContainer,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Button
          type="text"
          className="toggle"
          onClick={() => setCollapsed(!collapsed)}
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: '24px', transition: 'all 0.3s ease-in-out' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: '24px', transition: 'all 0.3s ease-in-out' }} />
            )
          }
          style={{
            fontSize: '18px',
            width: '50px',
            height: '50px',
            marginRight: collapsed ? '20px' : '-40px',
            transition: 'all 0.3s ease-in-out',
          }}
        />
      </Header>
      <div className="side" style={{ flexGrow: 1 }}>
        {/* Sidebar items */}
        {collapsed ? (
          <Tooltip title="Dashboard" placement="right">
            <NavLink
              to="/supersecret-admin-panel-a"
              end
              className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
              style={{ transition: 'all 0.3s ease-in-out' }}
              onClick={handleLinkClick}
            >
              <AreaChartOutlined />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to="/supersecret-admin-panel-a"
            end
            className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
            style={{ transition: 'all 0.3s ease-in-out' }}
            onClick={handleLinkClick}
          >
            <AreaChartOutlined />
            <span>Dashboard</span>
          </NavLink>
        )}

        {collapsed ? (
          <Tooltip title="Projects" placement="right">
            <NavLink
              to="/supersecret-admin-panel-a/projects"
              className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
              style={{ transition: 'all 0.3s ease-in-out' }}
              onClick={handleLinkClick}
            >
              <FolderOpenOutlined />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to="/supersecret-admin-panel-a/projects"
            className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
            style={{ transition: 'all 0.3s ease-in-out' }}
            onClick={handleLinkClick}
          >
            <FolderOpenOutlined />
            <span>Projects</span>
          </NavLink>
        )}

        {collapsed ? (
          <Tooltip title="Reports" placement="right">
            <NavLink
              to="/supersecret-admin-panel-a/reports"
              className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
              style={{ transition: 'all 0.3s ease-in-out' }}
              onClick={handleLinkClick}
            >
              <FileDoneOutlined />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to="/supersecret-admin-panel-a/reports"
            className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
            style={{ transition: 'all 0.3s ease-in-out' }}
            onClick={handleLinkClick}
          >
            <FileDoneOutlined />
            <span>Reports</span>
          </NavLink>
        )}

        {collapsed ? (
          <Tooltip title="Articles" placement="right">
            <NavLink
              to="/supersecret-admin-panel-a/articles"
              className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
              style={{ transition: 'all 0.3s ease-in-out' }}
              onClick={handleLinkClick}
            >
              <ContainerOutlined />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to="/supersecret-admin-panel-a/articles"
            className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
            style={{ transition: 'all 0.3s ease-in-out' }}
            onClick={handleLinkClick}
          >
            <ContainerOutlined />
            <span>Articles</span>
          </NavLink>
        )}

        {collapsed ? (
          <Tooltip title="Employees" placement="right">
            <NavLink
              to="/supersecret-admin-panel-a/employees"
              className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
              style={{ transition: 'all 0.3s ease-in-out' }}
              onClick={handleLinkClick}
            >
              <TeamOutlined />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to="/supersecret-admin-panel-a/employees"
            className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
            style={{ transition: 'all 0.3s ease-in-out' }}
            onClick={handleLinkClick}
          >
            <TeamOutlined />
            <span>Employees</span>
          </NavLink>
        )}

        <div className="logout-div">
          {collapsed ? (
            <Tooltip title="Logout" placement="right">
              <button className="logout-button collapsed" onClick={handleLogout}>
                <LogoutOutlined />
              </button>
            </Tooltip>
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              <LogoutOutlined style={{ marginRight: '10px', fontSize: 'x-large' }} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default AdminSidebar;