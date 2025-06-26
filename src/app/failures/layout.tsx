'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function FailuresLayout({
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

export default withAuth(FailuresLayout, ['technician', 'maintenance_manager']);
