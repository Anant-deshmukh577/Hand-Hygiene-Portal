import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useUIStore } from './stores/uiStore';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';

function App() {
  const { loading, isAuthenticated } = useAuth();
  const { sidebarOpen } = useUIStore();
  const location = useLocation();
  
  const noSidebarPages = ['/', '/login', '/register', '/forgot-password', '/admin/login', '/admin-login', '/auditor/login', '/auditor-login'];
  const showSidebar = isAuthenticated && !noSidebarPages.includes(location.pathname);
  
  const noFooterPages = ['/login', '/register', '/forgot-password', '/admin/login', '/admin-login', '/auditor/login', '/auditor-login'];
  const showFooter = !noFooterPages.includes(location.pathname);
  
  const noNavbarPages = ['/login', '/register', '/forgot-password', '/admin/login', '/admin-login', '/auditor/login', '/auditor-login'];
  const showNavbar = !noNavbarPages.includes(location.pathname);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {showNavbar && <Navbar />}
      
      <div className={`flex flex-1 overflow-x-hidden ${showNavbar ? 'pt-16' : 'pt-0'}`}>
        {showSidebar && <Sidebar />}
        
        <main className={`
          flex-1 flex flex-col w-full overflow-x-hidden
          transition-all duration-300 ease-in-out
          ${showSidebar && sidebarOpen ? 'ml-72' : 'ml-0'}
        `}>
          <Outlet />
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
