'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function AnalyticsLayout({
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

export default withAuth(AnalyticsLayout, ['maintenance_manager']);
