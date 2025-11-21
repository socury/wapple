import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import i18n from './libs/i18n';
import { Home } from './pages/Home';
import { SavedWifi } from './pages/SavedWifi';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<SavedWifi />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  );
};
