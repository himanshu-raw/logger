import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, PenSquare, User as UserIcon, Sun, Moon } from './Icons';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};


const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Dory
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {currentUser ? (
            <>
              <Link
                to="/create-post"
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <PenSquare className="w-5 h-5" />
                <span className="hidden sm:inline">Write</span>
              </Link>
              <Link
                to={`/profile/${currentUser.id}`}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{currentUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;