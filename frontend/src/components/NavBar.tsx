import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-brand-mid/20 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight text-brand-dark">
          Memo-rise
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="rounded-md px-3 py-2 hover:bg-brand-bg">
                Dashboard
              </Link>
              <button onClick={logout} className="rounded-md bg-brand-dark px-3 py-2 text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 hover:bg-brand-bg">
                Login
              </Link>
              <Link to="/register" className="rounded-md bg-brand-dark px-3 py-2 text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
