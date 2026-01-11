import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import { readCookie, deleteCookie } from "../helper/cookie"

const AppNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [token, setToken] = useState(readCookie("token"))
  const [search, setSearch] = useState("")
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  useEffect(()=>{

    setToken(readCookie("token"))

  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const logout = () => {
    deleteCookie("token")
    setToken(null)
    toast.success("Logged out successfully!");
    window.location.href = "/";
  }

  return (
    <nav className="bg-base-100/1 backdrop-blur-xs text-base-content p-4 sticky top-0 z-50 border-b border-base-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-gray-300 dark:hover:text-gray-300">Gadget Shop</Link>
        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="hover:text-gray-300 dark:hover:text-gray-300">Home</Link>
          <Link to="/cart" className="hover:text-gray-300 dark:hover:text-gray-300">Cart</Link>
          <Link to="/wish" className="hover:text-gray-300 dark:hover:text-gray-300">Wish</Link>
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="hover:text-gray-300 dark:hover:text-gray-300 flex items-center">
              Profile <span className="ml-1">▼</span>
            </button>
            {isProfileOpen && (
              token ? 
              <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg z-10 border border-base-300">
                <Link to="/profile" className="block px-4 py-2 hover:bg-base-200">Profile</Link>
                <Link to="/history" className="block px-4 py-2 hover:bg-base-200">Purchase History</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-base-200">Logout</button>
              </div>
              :
              <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg z-10 border border-base-300">
                <Link to="/login" className="block px-4 py-2 hover:bg-base-200">Login / Regestration</Link>
              </div>
            )}
          </div>
          <button onClick={toggleTheme} className="text-2xl">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="search"
            placeholder="Search"
            className="px-3 py-1 rounded text-base-content bg-base-100 border border-base-300" value={search} onChange={(e)=>{setSearch(e.target.value)}}
          />
          <button className="bg-primary hover:bg-primary text-primary-content px-4 py-1 rounded">Search</button>
        </div>
        <button className="md:hidden " onClick={() => setIsProfileOpen(!isProfileOpen)}>
          ☰
        </button>
      </div>
    </nav>
  );
}

export default AppNav