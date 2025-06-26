'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function AlertsLayout({
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

export default withAuth(AlertsLayout, ['maintenance_manager']);
