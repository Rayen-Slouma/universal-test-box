'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Attempting login with:', { email, password });
    const result = await login(email, password);
    console.log('Login result:', result);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-3xl font-bold text-gray-900">Universal Test Box</h2>
          <p className="mt-2 text-sm text-gray-600">
            Predictive Maintenance System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>
                  <strong>Technician:</strong> tech1@testbox.com / password123
                </div>
                <div>
                  <strong>Manager:</strong> manager@testbox.com / password123
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('tech1@testbox.com');
                    setPassword('password123');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline block"
                >
                  Fill Technician Credentials
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('manager@testbox.com');
                    setPassword('password123');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline block"
                >
                  Fill Manager Credentials
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
