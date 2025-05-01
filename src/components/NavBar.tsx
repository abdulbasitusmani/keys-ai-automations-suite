
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-medium" : "text-gray-800 hover:text-primary";
  };

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        
        {isMobile ? (
          <>
            <button onClick={toggleMenu} className="p-2">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {menuOpen && (
              <div className="fixed inset-0 top-16 z-50 bg-white animate-fade-in">
                <nav className="flex flex-col p-6 space-y-4">
                  {!user ? (
                    <>
                      <Link 
                        to="/login" 
                        className="py-2 text-center text-gray-800 hover:text-primary"
                        onClick={closeMenu}
                      >
                        Log In
                      </Link>
                      <Button 
                        onClick={() => {
                          closeMenu();
                          navigate('/signup');
                        }}
                        className="w-full"
                      >
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/dashboard" 
                        className={`py-2 text-center ${isActive('/dashboard')}`}
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/agents" 
                        className={`py-2 text-center ${isActive('/agents')}`}
                        onClick={closeMenu}
                      >
                        Agents
                      </Link>
                      <Link 
                        to="/packages" 
                        className={`py-2 text-center ${isActive('/packages')}`}
                        onClick={closeMenu}
                      >
                        Packages
                      </Link>
                      <Button 
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full"
                      >
                        Log Out
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link to="/login" className={isActive('/login')}>Log In</Link>
                <Button onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                <Link to="/agents" className={isActive('/agents')}>Agents</Link>
                <Link to="/packages" className={isActive('/packages')}>Packages</Link>
                <Button onClick={handleLogout} variant="outline">Log Out</Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;
