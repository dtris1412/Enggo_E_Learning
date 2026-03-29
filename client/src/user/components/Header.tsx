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
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState("Free");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const learningDropdownRef = useRef<HTMLDivElement>(null);
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
      if (
        learningDropdownRef.current &&
        !learningDropdownRef.current.contains(event.target as Node)
      ) {
        setLearningDropdownOpen(false);
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
    { path: "/blog", label: "Blog" },
    { path: "/exams", label: "Thi thử online" },
  ];

  // Learning Corner dropdown items
  const learningItems = [
    { path: "/my-learning", label: "Góc học", requireAuth: true },
    { path: "/documents", label: "Tài liệu", requireAuth: false },
    { path: "/flashcards", label: "Flashcards", requireAuth: true },
  ];

  // Add conditional nav items based on user status
  let allNavItems = [...navItems];

  // Add Admin link if user is admin (role = 1)
  if (user?.role === 1) {
    allNavItems = [
      ...allNavItems,
      { path: "/admin/dashboard", label: "Quản trị" },
    ];
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
          >
            <BookOpen className="h-8 w-8 text-violet-600" />
            <span className="text-xl font-black text-slate-900">Enggo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {allNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    location.pathname === item.path
                      ? "text-violet-600 border-b-2 border-violet-600"
                      : "text-slate-700 hover:text-violet-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Learning Corner Dropdown */}
            <div className="relative" ref={learningDropdownRef}>
              <button
                onClick={() => setLearningDropdownOpen(!learningDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  learningItems.some((item) => location.pathname === item.path)
                    ? "text-violet-600 border-b-2 border-violet-600"
                    : "text-slate-700 hover:text-violet-600"
                }`}
              >
                <span>Góc học tập</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    learningDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Learning Dropdown Menu */}
              {learningDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-2 z-50 animate-fade-in">
                  {learningItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.requireAuth && !user ? "/login" : item.path}
                      onClick={() => setLearningDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors duration-150 ${
                        location.pathname === item.path
                          ? "text-violet-600 bg-violet-50 font-medium"
                          : "text-slate-700 hover:bg-slate-50 hover:text-violet-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {/* Upgrade Button - Desktop */}
                {userSubscription.toLowerCase() !== "premium" && (
                  <Link
                    to="/subscription"
                    className="flex items-center space-x-2 bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-violet-700 transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="drop-shadow-sm">Nâng cấp</span>
                  </Link>
                )}

                <div className="relative" ref={dropdownRef}>
                  {/* Avatar with Subscription Badge */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-slate-50 rounded-lg p-2 transition-all duration-200"
                  >
                    {/* Avatar Circle */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.user_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {/* Subscription Badge */}
                      <div className="absolute -bottom-1.5 left-6 bg-violet-700 text-[10px] font-bold text-white px-2 py-0.5 rounded-full border-2 border-white">
                        {userSubscription.toLowerCase()}
                      </div>
                    </div>

                    {/* Dropdown Arrow */}
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-2 z-50 animate-fade-in">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">
                          {user.user_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {user.user_email}
                        </p>
                        <div className="mt-2 inline-flex items-center px-3 py-1 bg-violet-50 border border-violet-200 rounded">
                          <span className="text-xs font-semibold text-violet-700">
                            {userSubscription} Member
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors duration-150"
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
                  className="text-slate-700 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-violet-700 transition-colors duration-200"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition-all duration-200"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 py-4 animate-fade-in">
              <nav className="flex flex-col space-y-2">
                {allNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? "text-violet-600 bg-violet-50"
                        : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Learning Corner Section - Mobile */}
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Góc học tập
                  </div>
                  {learningItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.requireAuth && !user ? "/login" : item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-3 py-2 pl-6 rounded-md text-sm font-medium transition-all duration-200 flex ${
                        location.pathname === item.path
                          ? "text-violet-600 bg-violet-50"
                          : "text-slate-700 hover:text-violet-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200 mt-4">
                  {user ? (
                    <>
                      {/* Upgrade Button - Mobile */}
                      {userSubscription.toLowerCase() !== "premium" && (
                        <Link
                          to="/subscription"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center space-x-2 bg-violet-600 text-white px-4 py-3 rounded-md text-sm font-semibold mx-3 hover:bg-violet-700 transition-colors duration-200"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span className="drop-shadow-sm">
                            Nâng cấp gói subscription
                          </span>
                        </Link>
                      )}

                      {/* User Info Card - Mobile */}
                      <div className="bg-violet-50 rounded-md p-4 mx-3 mb-2">
                        <div className="flex items-center space-x-3">
                          {/* Avatar with Badge */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.user_name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            {/* Subscription Badge */}
                            <div className="absolute -bottom-1.5 left-7 bg-violet-700 text-[10px] font-bold text-white px-2 py-0.5 rounded-full border-2 border-white">
                              {userSubscription.toLowerCase()}
                            </div>
                          </div>

                          {/* User Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {user.user_name}
                            </p>
                            <p className="text-xs text-slate-600 truncate">
                              {user.user_email}
                            </p>
                            <div className="mt-1 inline-flex items-center px-2 py-0.5 bg-violet-50 border border-violet-200 rounded">
                              <span className="text-xs font-semibold text-violet-700">
                                {userSubscription}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-md mx-3 transition-all duration-200"
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
                        className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-50"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-3 py-2 rounded-lg text-sm font-bold mx-3 transition-all duration-200 hover:shadow-md"
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
