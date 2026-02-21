import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Call the new backend API
    fetch(`http://localhost:5000/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.data.user));
          localStorage.setItem('token', data.data.token);
          window.location.href = '/'; 
        } else {
          alert(data.message || "Invalid email or password");
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert("Login failed. Please try again.");
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