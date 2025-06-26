'use client';

import Layout from '@/components/Layout';
import { withAuth } from '@/contexts/AuthContext';

function MachinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

export default withAuth(MachinesLayout);
