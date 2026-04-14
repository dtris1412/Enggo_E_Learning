import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../shared/contexts/authContext";
import { useToast } from "../../shared/components/Toast/Toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState("Free");
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const learningDropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  // Close dropdown khi click ngoài
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

  // Fetch Subscription & Token Balance (giữ nguyên logic cũ của bạn)
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setUserSubscription("Free");
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/subscriptions/active`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const result = await res.json();
        if (result.success) setUserSubscription(result.planName || "Free");
      } catch (e) {
        setUserSubscription("Free");
      }
    };

    const fetchTokenBalance = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/wallet`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const result = await res.json();
        if (result.success) setTokenBalance(result.data?.token_balance ?? 0);
      } catch (e) {}
    };

    fetchSubscription();
    fetchTokenBalance();
  }, [user?.user_id]);

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/about", label: "Giới thiệu" },
    { path: "/courses", label: "Chương trình học" },
    { path: "/blog", label: "Blog" },
    { path: "/exams", label: "Thi thử online" },
  ];

  const learningItems = [
    { path: "/my-learning", label: "Góc học", requireAuth: true },
    { path: "/documents", label: "Tài liệu", requireAuth: false },
    { path: "/flashcards", label: "Flashcards", requireAuth: true },
  ];

  let allNavItems = [...navItems];
  if (user?.role === 1) {
    allNavItems.push({ path: "/admin/dashboard", label: "Quản trị" });
  }

  const isPremium = userSubscription.toLowerCase() === "premium";

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="./dist/public/img/logo/logo.png"
                alt="Enggo"
                className="h-20 w-auto"
              />
            </Link>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <nav className="hidden lg:flex items-center gap-10">
              {allNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium text-base transition-colors ${
                    location.pathname === item.path
                      ? "text-violet-600 border-b-2 border-violet-600 pb-1"
                      : "text-slate-700 hover:text-violet-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Góc học tập Dropdown - Desktop */}
              <div className="relative" ref={learningDropdownRef}>
                <button
                  onClick={() => setLearningDropdownOpen(!learningDropdownOpen)}
                  className="flex items-center gap-1 font-medium text-base text-slate-700 hover:text-violet-600"
                >
                  Góc học tập
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${learningDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {learningDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border py-2 z-50">
                    {learningItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.requireAuth && !user ? "/login" : item.path}
                        onClick={() => setLearningDropdownOpen(false)}
                        className="block px-6 py-3 hover:bg-violet-50 text-slate-700 hover:text-violet-600"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  {!isPremium && (
                    <Link
                      to="/subscription"
                      className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Nâng cấp
                    </Link>
                  )}

                  {tokenBalance !== null && (
                    <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-2xl text-sm font-medium text-violet-700">
                      <Zap className="w-4 h-4" />
                      {tokenBalance.toLocaleString()}
                    </div>
                  )}

                  {/* User Avatar Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3"
                    >
                      <div className="w-9 h-9 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-bold">
                        {user.user_name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100"
                        >
                          <UserCircle className="w-5 h-5" />
                          Trang cá nhân
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            showToast("success", "Đăng xuất thành công!");
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-5 h-5" />
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-medium text-slate-700 hover:text-violet-600 px-4 py-2"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-violet-600 text-white px-6 py-2.5 rounded-2xl font-semibold hover:bg-violet-700"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-slate-700"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE MENU - CÁC TAB RÕ RÀNG (Render ngoài header) ==================== */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto w-full">
          <div className="p-6 space-y-8">
            {/* Main Tabs */}
            <div>
              <p className="text-xs font-bold text-slate-500 mb-4">
                MENU CHÍNH
              </p>
              <div className="flex flex-col gap-2">
                {allNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-6 py-5 rounded-2xl text-lg font-medium transition-all ${
                      location.pathname === item.path
                        ? "bg-violet-100 text-violet-700 font-semibold"
                        : "hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Góc học tập */}
            <div>
              <p className="text-xs font-bold text-slate-500 mb-4">
                GÓC HỌC TẬP
              </p>
              <div className="flex flex-col gap-2">
                {learningItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.requireAuth && !user ? "/login" : item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-6 py-5 rounded-2xl text-lg font-medium transition-all ${
                      location.pathname === item.path
                        ? "bg-violet-100 text-violet-700 font-semibold"
                        : "hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Area */}
            {user ? (
              <div className="pt-6 border-t">
                <div className="bg-violet-50 rounded-3xl p-6 mb-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {user.user_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{user.user_name}</p>
                    <p className="text-sm text-slate-600">{user.user_email}</p>
                  </div>
                </div>

                {!isPremium && (
                  <Link
                    to="/subscription"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-violet-600 text-white py-4 rounded-2xl font-semibold mb-4"
                  >
                    Nâng cấp Premium
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-5 text-lg hover:bg-slate-100 rounded-2xl"
                >
                  Trang cá nhân
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    showToast("success", "Đăng xuất thành công!");
                    setIsMenuOpen(false);
                    navigate("/");
                  }}
                  className="block w-full text-left px-6 py-5 text-red-600 hover:bg-red-50 rounded-2xl text-lg"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pt-6">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-5 text-center border border-slate-300 rounded-2xl text-lg font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-5 text-center bg-violet-600 text-white rounded-2xl text-lg font-semibold"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
