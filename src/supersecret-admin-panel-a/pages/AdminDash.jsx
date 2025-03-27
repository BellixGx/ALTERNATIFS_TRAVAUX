import React from "react";
import '../Admin.css';
import { useTranslation } from 'react-i18next';
const AdminDash = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('dashboard.the Admin Dashboard')}</h1>
      
    </div>
  );
};

export default AdminDash;