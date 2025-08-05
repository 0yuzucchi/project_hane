import React from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function Home({ message, auth }) {
  const { post } = useForm();

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Hane 羽</h1>
        <p className="text-gray-700 mb-6">{message}</p>

        {auth?.user ? (
          <>
            <p className="text-sm mb-4">
              Halo, <span className="font-semibold">{auth.user.name}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
