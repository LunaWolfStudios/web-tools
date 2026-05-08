import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Settings, GitBranch, Github } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CourseView from './pages/CourseView';
import AssignmentView from './pages/AssignmentView';
import CoursesPage from './pages/CoursesPage';
import CalendarPage from './pages/CalendarPage';
import RepositoriesPage from './pages/RepositoriesPage';
import NotificationDropdown from './components/NotificationDropdown';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0b0c10]/80 backdrop-blur-xl flex flex-col items-stretch z-20 shrink-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold font-display neon-text flex items-center gap-2">
              <img src="/logo.png" alt="Luna LMS" className="w-8 h-8 rounded-lg object-contain shadow-[0_0_10px_rgba(102,252,241,0.5)]" />
              Luna LMS
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 mt-4 px-4 overflow-hidden">Menu</div>
            <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} />
              <span>Courses</span>
            </NavLink>
            <NavLink to="/calendar" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={20} />
              <span>Calendar</span>
            </NavLink>
            <NavLink to="/repositories" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Github size={20} />
              <span>Repositories</span>
            </NavLink>
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white/10" />
              <div>
                <p className="text-sm font-medium text-white">Alex Chen</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative h-full overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 border-b border-white/10 bg-[#0b0c10]/60 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
            <div className="flex-1 flex items-center gap-4">
               {/* Breadcrumbs or search could go here */}
            </div>
            <div className="flex items-center gap-4">
              <NotificationDropdown />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:id" element={<CourseView />} />
                <Route path="/assignment/:id" element={<AssignmentView />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/repositories" element={<RepositoriesPage />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}
