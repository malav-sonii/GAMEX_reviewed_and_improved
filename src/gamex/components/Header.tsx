import { useState } from 'react';

type Page = 'home' | 'arenas' | 'arena-detail' | 'booking' | 'payment' | 'confirmation' | 'events' | 'dashboard';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  loggedIn?: boolean;
  userInitial?: string;
  onLogin: () => void;
  onSignUp: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export default function Header({
  currentPage,
  onNavigate,
  loggedIn = false,
  userInitial = 'M',
  onLogin,
  onSignUp,
  onOpenProfile,
  onLogout,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Arenas', page: 'arenas' },
    { label: 'Events', page: 'events' },
    { label: 'About', page: 'home' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(9,9,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            🎮
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0eeff' }}
          >
            GAME<span className="gradient-text">X</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: currentPage === item.page ? '#a78bfa' : '#a09ab8',
                background: currentPage === item.page ? 'rgba(139,92,246,0.1)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {loggedIn ? (
            <button
              onClick={onOpenProfile}
              aria-label="Open user profile"
              title="Open user profile"
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              {userInitial}
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ color: '#a09ab8' }}
                onClick={onLogin}
              >
                Login
              </button>
              <button
                className="btn-primary px-4 py-2 text-sm"
                onClick={onSignUp}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg"
          style={{ color: '#a09ab8' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen ? (
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { onNavigate(item.page); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ color: '#a09ab8' }}
            >
              {item.label}
            </button>
          ))}
          {loggedIn && (
            <button
              onClick={() => {
                onOpenProfile();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ color: '#a78bfa' }}
            >
              <span className="mr-3" aria-hidden="true">👤</span>
              My Profile
            </button>
          )}
          <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {loggedIn ? (
              <>
                <button className="flex-1 py-2 text-sm rounded-lg" style={{ color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }} onClick={() => onNavigate('dashboard')}>
                  Dashboard
                </button>
                <button className="flex-1 py-2 text-sm rounded-lg" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }} onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="flex-1 py-2 text-sm rounded-lg" style={{ color: '#a09ab8', border: '1px solid rgba(255,255,255,0.1)' }} onClick={onLogin}>
                  Login
                </button>
                <button className="btn-primary flex-1 py-2 text-sm" onClick={onSignUp}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
