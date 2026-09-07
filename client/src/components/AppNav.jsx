import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { UserLogout, checkToken } from "../APIRequest/APIRequest";
import { deleteCookie } from "../helper/cookie";

const AppNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPeek, setDrawerPeek] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const validateAuth = async () => {
      const res = await checkToken();
      setIsAuthenticated(Boolean(res?.validation));
    };
    validateAuth();
  }, [location]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = document.scrollingElement?.scrollTop || 0;
      setIsNavVisible(currentScrollY <= 8 || currentScrollY < lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = async () => {
    await UserLogout();
    deleteCookie("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const keyword = search.trim();
    if (keyword) {
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
      setDrawerOpen(false);
    }
  };

  return (
    <nav className={`bg-base-100/80 backdrop-blur-sm text-base-content sticky top-0 z-50 border-b border-base-300 transition-transform duration-300 ease-out ${isNavVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="scroll- container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Gadget Shop
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wish">Wish</Link>

          {/* Profile or Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                Profile ▼
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 border border-base-300 rounded shadow">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-base-200">
                    Profile
                  </Link>
                  <Link to="/history" className="block px-4 py-2 hover:bg-base-200">
                    Purchase History
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-base-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline btn-sm"
            >
              Login / Registration
            </Link>
          )}

          {/* Theme */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-18 h-9 rounded-full bg-base-300 transition-colors"
          >
            {/* Moving knob */}
            <span
              className={`w-10 flex transition-all duration-300 ease-in-out
      ${isDark ? "translate-x-8" : "translate-x-0"}`}
            >
              <span className="text-2xl mb-1">
                {isDark ? "🌙" : "☀️"}
              </span>
            </span>
          </button>
        </div>

        {/* Search */}
        <form onSubmit={submitSearch} className="items-center gap-2">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 rounded bg-base-100 border border-base-300"
          />
          <button type="submit" className="bg-primary text-primary-content px-4 py-1 rounded">
            Search
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setDrawerOpen(true)}
          onMouseEnter={() => setDrawerPeek(true)}
          onMouseLeave={() => setDrawerPeek(false)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer */}

      <div className={`md:hidden flex flex-col fixed right-0 top-0 h-screen w-2xs z-50 p-6 space-y-5 bg-base-100/90 backdrop-blur text-base-content
  transform transition-transform duration-500 ease-out
  ${drawerOpen ? "translate-x-0" : drawerPeek ? "translate-x-[92%] px-2" : "translate-x-full"}`}
      >
        <div className="flex justify-between">
          <button
            className="text-xl self-start"
            onClick={() => setDrawerOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 38.13 27.94"
              className="w-6 h-6 text-base-content"
              fill="currentColor"
            >
              <path d="m22.34,23.57c-1,1-1,2.62,0,3.62.5.5,1.16.75,1.81.75s1.32-.25,1.82-.75l7.9-7.9-3.75-3.5-7.78,7.78Z" />
              <path d="m37.38,12.16L25.97.75c-1-1-2.63-1-3.63,0s-1,2.62,0,3.63l9.6,9.59,3.74,3.51,1.7-1.7c1-1,1-2.62,0-3.62Z" />
              <path d="m.75,23.57c-1,1-1,2.62,0,3.62.5.5,1.16.75,1.81.75s1.32-.25,1.82-.75l7.9-7.9-3.75-3.5L.75,23.57Z" />
              <path d="m4.38.75C3.37-.25,1.75-.25.75.75S-.25,3.37.75,4.38l9.6,9.59,3.74,3.51,1.7-1.7c1-1,1-2.62,0-3.62L4.38.75Z" />
            </svg>
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-18 h-9 rounded-full bg-base-300 transition-colors"
          >
            {/* Moving knob */}
            <span
              className={`w-10 flex transition-all duration-300 ease-in-out
      ${isDark ? "translate-x-8" : "translate-x-0"}`}
            >
              <span className="text-2xl mb-1">
                {isDark ? "🌙" : "☀️"}
              </span>
            </span>
          </button>
        </div>

        <Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link>
        <Link to="/cart" onClick={() => setDrawerOpen(false)}>Cart</Link>
        <Link to="/wish" onClick={() => setDrawerOpen(false)}>Wish</Link>

        <div className="w-full">
          <button
            className="w-full text-left px-4 py-3 rounded bg-base-200"
            onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
          >
            Profile
          </button>

          {mobileProfileOpen && (
            <div className="mt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => { setDrawerOpen(false); setMobileProfileOpen(false); }}
                    className="block px-4 py-2 rounded hover:bg-base-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => { setDrawerOpen(false); setMobileProfileOpen(false); }}
                    className="block px-4 py-2 rounded hover:bg-base-200"
                  >
                    Purchase History
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setDrawerOpen(false);
                      setMobileProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded hover:bg-base-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => { setDrawerOpen(false); setMobileProfileOpen(false); }}
                  className="block px-4 py-2 rounded hover:bg-base-200"
                >
                  Login / Registration
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

    </nav>
  );
};

export default AppNav;
