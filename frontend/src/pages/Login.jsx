import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Querying the API for matching email and password
    fetch(`http://localhost:3000/users?email=${email}&password=${password}`)
      .then(res => res.json())
      .then(users => {
        if (users.length > 0) {
          localStorage.setItem('currentUser', JSON.stringify(users[0]));
          window.location.href = '/'; 
        } else {
          alert("Invalid email or password");
        }
      });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center">Author Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                 className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                 className="w-full border p-2 rounded mt-1" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
}