import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./user/components/Header.tsx";
import Footer from "./user/components/Footer.tsx";
import Home from "./user/pages/Home.tsx";
import About from "./user/pages/About.tsx";
import Courses from "./user/pages/Courses.tsx";
import Resources from "./user/pages/Resources.tsx";
import Blog from "./user/pages/Blog.tsx";
import OnlineTests from "./user/pages/OnlineTests.tsx";
import Login from "./user/pages/Login.tsx";
import Register from "./user/pages/Register.tsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/tests" element={<OnlineTests />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
