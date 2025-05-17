'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
axios.defaults.withCredentials = true;
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: email,
        user_pass: pass,
      }),
    });

    const data = await res.json();

    if (res.ok) {
        console.log('Login successful');
        console.log('Received Token:', data.access_token);
        console.log('User Info:', data.user); 
        router.push('/dashboard-admin'); 
      } else {
        console.error('Login failed:', data.message);
        const message = data.message || 'Login failed';
        setError(message);
        toast.error(message); 
      }

  };

  return (
    <div className="p-8 max-w-md mx-auto">
            <Toaster /> 
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
