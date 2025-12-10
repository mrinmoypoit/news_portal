import {Link} from 'react-router'
export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      <Link to="/" className="font-black text-xl tracking-tight">NEWS PORTAL</Link>
      <div className="flex gap-6 items-center">
        <Link to="/">Feed</Link>
        {user ? (
          <>
            <Link to="/create" className="bg-blue-600 px-3 py-1 rounded">+ Create News</Link>
            <span className="text-gray-400">|</span>
            <span className="font-bold">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={logout} className="text-xs underline text-gray-400">Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-green-600 px-4 py-1 rounded font-bold">Login</Link>
        )}
      </div>
    </nav>
  );
}