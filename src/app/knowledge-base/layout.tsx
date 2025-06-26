'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function KnowledgeBaseLayout({
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

export default withAuth(KnowledgeBaseLayout, ['technician', 'maintenance_manager']);
