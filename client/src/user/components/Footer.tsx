import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-black">Enggo</span>
            </div>
            <p className="text-slate-400 mb-4">
              Nền tảng học tiếng Anh trực tuyến với trí tuệ nhân tạo - cá nhân
              hóa lộ trình, nâng cao hiệu quả.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-slate-500 hover:text-pink-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Khóa học
                </Link>
              </li>
              <li>
                <Link
                  to="/exams"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Thi thử
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-300">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-300">contact@enggo.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-slate-300">123 ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-500">
            © 2026 Enggo E-Learning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
