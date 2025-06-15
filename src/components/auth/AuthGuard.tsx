
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AuthPage from './AuthPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppStore();

  // Show loading while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  // Show app if authenticated
  return <>{children}</>;
};

export default AuthGuard;
