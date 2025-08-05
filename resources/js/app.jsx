import React from 'react';
import ReactDOM from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react'; // ✅ pakai yang baru
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './bootstrap';
import '../css/app.css';

createInertiaApp({
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    ReactDOM.createRoot(el).render(<App {...props} />);
  },
});
