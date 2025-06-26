'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

export default withAuth(UsersLayout, ['maintenance_manager']);
