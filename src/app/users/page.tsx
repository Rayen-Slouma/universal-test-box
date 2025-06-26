'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, UserRole } from '@/types';
import { formatDateTime, timeAgo } from '@/lib/utils';

// Mock user data (expanded)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'tech1@testbox.com',
    name: 'John Technician',
    role: 'technician',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '2',
    email: 'manager@testbox.com',
    name: 'Sarah Manager',
    role: 'maintenance_manager',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-25'),
  },
  {
    id: '3',
    email: 'tech2@testbox.com',
    name: 'Mike Thompson',
    role: 'technician',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '4',
    email: 'alex.tech@testbox.com',
    name: 'Alex Rodriguez',
    role: 'technician',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-06-10'),
  },
  {
    id: '5',
    email: 'lisa.manager@testbox.com',
    name: 'Lisa Chen',
    role: 'maintenance_manager',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-06-22'),
  },
  {
    id: '6',
    email: 'bob.tech@testbox.com',
    name: 'Bob Wilson',
    role: 'technician',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-06-18'),
  },
];

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'technician', label: 'Technician' },
  { value: 'maintenance_manager', label: 'Maintenance Manager' },
];

interface CreateUserForm {
  name: string;
  email: string;
  role: UserRole;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    role: 'technician',
  });

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Statistics
  const stats = {
    total: users.length,
    technicians: users.filter(u => u.role === 'technician').length,
    managers: users.filter(u => u.role === 'maintenance_manager').length,
    activeToday: users.filter(u => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return u.updatedAt >= today;
    }).length,
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.name || !createForm.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === createForm.email)) {
      alert('A user with this email already exists');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: createForm.name,
      email: createForm.email,
      role: createForm.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUsers(prev => [...prev, newUser]);
    setCreateForm({ name: '', email: '', role: 'technician' });
    setShowCreateForm(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    if (userId === currentUser?.id) {
      alert('You cannot change your own role');
      return;
    }

    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, updatedAt: new Date() }
          : user
      )
    );
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'maintenance_manager': return 'text-purple-600 bg-purple-100';
      case 'technician': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'maintenance_manager': return 'Manager';
      case 'technician': return 'Technician';
      default: return role;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and their access permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          Add New User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.managers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Technicians</p>
                <p className="text-2xl font-bold text-blue-600">{stats.technicians}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
                <Select
                  label="Role"
                  value={createForm.role}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  options={[
                    { value: 'technician', label: 'Technician' },
                    { value: 'maintenance_manager', label: 'Maintenance Manager' },
                  ]}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  Create User
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole)}
              options={roleOptions}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        {user.id === currentUser?.id && (
                          <div className="text-xs text-blue-600">(You)</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {formatDateTime(user.createdAt).split(' ')[0]}
                      </div>
                      <div className="text-gray-500">
                        {timeAgo(user.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {formatDateTime(user.updatedAt).split(' ')[0]}
                      </div>
                      <div className="text-gray-500">
                        {timeAgo(user.updatedAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.id !== currentUser?.id && (
                        <>
                          <Select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                            options={[
                              { value: 'technician', label: 'Technician' },
                              { value: 'maintenance_manager', label: 'Manager' },
                            ]}
                            className="w-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      {user.id === currentUser?.id && (
                        <span className="text-sm text-gray-500">Current User</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
