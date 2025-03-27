import React, { useEffect } from 'react';
import { Layout, Button, Tooltip, theme } from 'antd';
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import {
  AreaChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
  ContainerOutlined,
  TeamOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '../../../src/authProvider';
import Flag from 'react-flagkit';
import './SideBar.css';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { Sider, Header } = Layout;
  const { token: { colorBgContainer } } = theme.useToken();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setCollapsed(true);
  }, [setCollapsed]);

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

  const supportedLanguages = ["en", "fr"];
  const languageMap = {
    en: { code: "US", key: "sidebar.toggleLanguage.en" },
    fr: { code: "FR", key: "sidebar.toggleLanguage.fr" },
  };

  const toggleLanguage = () => {
    const currentIndex = supportedLanguages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const newLang = supportedLanguages[nextIndex];
    i18n.changeLanguage(newLang);
  };

  const menuItems = [
    { path: "/supersecret-admin-panel-a", icon: <AreaChartOutlined />, key: "sidebar.dashboard", exact: true },
    { path: "/supersecret-admin-panel-a/projects", icon: <FolderOpenOutlined />, key: "sidebar.projects" },
    { path: "/supersecret-admin-panel-a/reports", icon: <FileDoneOutlined />, key: "sidebar.reports" },
    { path: "/supersecret-admin-panel-a/articles", icon: <ContainerOutlined />, key: "sidebar.articles" },
    { path: "/supersecret-admin-panel-a/employees", icon: <TeamOutlined />, key: "sidebar.employees" },
  ];

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
        {menuItems.map((item) => (
          collapsed ? (
            <Tooltip key={item.key} title={t(item.key)} placement="right">
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
                style={{ transition: 'all 0.3s ease-in-out' }}
                onClick={handleLinkClick}
              >
                {item.icon}
              </NavLink>
            </Tooltip>
          ) : (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `nav-option ${isActive ? 'active2' : ''}`}
              style={{ transition: 'all 0.3s ease-in-out' }}
              onClick={handleLinkClick}
            >
              {item.icon}
              <span>{t(item.key)}</span>
            </NavLink>
          )
        ))}

        <div className="logout-div">
          <div>
            {collapsed ? (
              <Tooltip title={t("sidebar.language")} placement="right">
                <button onClick={toggleLanguage} className="custom-button language-button collapsed">
                  <TranslationOutlined />
                  <Flag country={languageMap[i18n.language]?.code || "US"} size={20} style={{ marginLeft: '5px' }} />
                </button>
              </Tooltip>
            ) : (
              <button onClick={toggleLanguage} className="custom-button language-button">
                <TranslationOutlined style={{ marginRight: '10px', fontSize: 'x-large' }} />
                <Flag country={languageMap[i18n.language]?.code || "US"} size={20} style={{ marginRight: '5px' }} />
                {t(languageMap[i18n.language]?.key || "sidebar.language")}
              </button>
            )}
          </div>
          <div>
            {collapsed ? (
              <Tooltip title={t("sidebar.logout")} placement="right">
                <button className="custom-button logout-button collapsed" onClick={handleLogout}>
                  <LogoutOutlined />
                </button>
              </Tooltip>
            ) : (
              <button className="custom-button logout-button" onClick={handleLogout}>
                <LogoutOutlined style={{ marginRight: '10px', fontSize: 'x-large' }} />
                <span>{t("sidebar.logout")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default AdminSidebar;