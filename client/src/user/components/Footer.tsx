import { BookOpen, Mail, Phone, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">EnglishMaster</span>
            </div>
            <p className="text-gray-300 mb-4">
              Nền tảng học tiếng Anh trực tuyến hàng đầu với phương pháp hiện đại và hiệu quả.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">Giới thiệu</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-white">Khóa học</Link></li>
              <li><Link to="/tests" className="text-gray-300 hover:text-white">Thi thử</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">contact@englishmaster.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">123 ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 EnglishMaster. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;