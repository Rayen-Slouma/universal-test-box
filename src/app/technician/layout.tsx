'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

export default withAuth(TechnicianLayout);
