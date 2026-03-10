import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCircle,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../shared/contexts/authContext";
import { useToast } from "../../shared/components/Toast/Toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState("Free");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user subscription plan
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setUserSubscription("Free");
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setUserSubscription("Free");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/subscriptions/active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (result.success) {
          // API now returns planName at top level
          setUserSubscription(result.planName || "Free");
        } else {
          setUserSubscription("Free");
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setUserSubscription("Free");
      }
    };

    fetchSubscription();

    // Listen for subscription update events (after payment success)
    const handleSubscriptionUpdate = () => {
      fetchSubscription();
    };

    window.addEventListener("subscriptionUpdated", handleSubscriptionUpdate);

    return () => {
      window.removeEventListener(
        "subscriptionUpdated",
        handleSubscriptionUpdate,
      );
    };
  }, [user?.user_id]); // Re-fetch when user changes

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/about", label: "Giới thiệu" },
    { path: "/courses", label: "Chương trình học" },
    { path: "/documents", label: "Tài liệu" },
    { path: "/blog", label: "Blog" },
    { path: "/tests", label: "Thi thử online" },
  ];

  // Add Admin link if user is admin (role = 1)
  const allNavItems =
    user?.role === 1
      ? [...navItems, { path: "/admin/dashboard", label: "Quản trị" }]
      : navItems;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
          >
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Enggo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {allNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  location.pathname === item.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {/* Upgrade Button - Desktop */}
                {userSubscription.toLowerCase() !== "premium" && (
                  <Link
                    to="/subscription"
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-shimmer bg-[length:200%_100%]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="drop-shadow-sm">Nâng cấp</span>
                  </Link>
                )}

                <div className="relative" ref={dropdownRef}>
                  {/* Avatar with Subscription Badge */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-all duration-200"
                  >
                    {/* Avatar Circle */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {user.user_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {/* Subscription Badge */}
                      <div className="absolute -bottom-1.5 left-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-md border-2 border-white animate-shimmer bg-[length:200%_100%]">
                        {userSubscription.toLowerCase()}
                      </div>
                    </div>

                    {/* Dropdown Arrow */}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.user_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.user_email}
                        </p>
                        <div className="mt-2 inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-full shadow-sm">
                          <span className="text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {userSubscription} Member
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        >
                          <UserCircle className="w-4 h-4 mr-3" />
                          Trang cá nhân
                        </Link>

                        <button
                          onClick={async () => {
                            setIsDropdownOpen(false);
                            await logout();
                            showToast("success", "Đăng xuất thành công!");
                            navigate("/");
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 animate-fade-in">
              <nav className="flex flex-col space-y-2">
                {allNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 mt-4">
                  {user ? (
                    <>
                      {/* Upgrade Button - Mobile */}
                      {userSubscription.toLowerCase() !== "premium" && (
                        <Link
                          to="/subscription"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-4 py-3 rounded-lg text-sm font-semibold mx-3 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-shimmer bg-[length:200%_100%]"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span className="drop-shadow-sm">
                            Nâng cấp gói subscription
                          </span>
                        </Link>
                      )}

                      {/* User Info Card - Mobile */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mx-3 mb-2">
                        <div className="flex items-center space-x-3">
                          {/* Avatar with Badge */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                              {user.user_name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            {/* Subscription Badge */}
                            <div className="absolute -bottom-1.5 left-7 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-md border-2 border-white animate-shimmer bg-[length:200%_100%]">
                              {userSubscription.toLowerCase()}
                            </div>
                          </div>

                          {/* User Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.user_name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {user.user_email}
                            </p>
                            <div className="mt-1 inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full shadow-sm">
                              <span className="text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                ✨ {userSubscription}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md mx-3 transition-all duration-200"
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>Trang cá nhân</span>
                      </Link>

                      <button
                        onClick={async () => {
                          await logout();
                          showToast("success", "Đăng xuất thành công!");
                          setIsMenuOpen(false);
                          navigate("/");
                        }}
                        className="flex items-center space-x-3 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 mx-3 transition-all duration-200 hover:shadow-md"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 mx-3 transition-all duration-200 hover:shadow-md"
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
