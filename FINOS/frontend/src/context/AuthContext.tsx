import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../types';

export interface PositionDefinition {
  role: UserRole;
  title: string;
  hierarchyLevel: number;
  department: string;
  primaryDomain: string;
  allowedDomains: string[];
}

export const POSITION_LIST: PositionDefinition[] = [
  {
    role: 'CEO',
    title: 'Chief Executive Officer (CEO)',
    hierarchyLevel: 4,
    department: 'Executive Cabinet & Capital Allocation',
    primaryDomain: 'ceo.finos.gov.in',
    allowedDomains: ['ceo.finos.gov.in', 'exec.finos.gov.in', 'finos.gov.in']
  },
  {
    role: 'DIRECTOR',
    title: 'Regional Director / Higher Official',
    hierarchyLevel: 3,
    department: 'Infrastructure & Regional Governance',
    primaryDomain: 'director.finos.gov.in',
    allowedDomains: ['director.finos.gov.in', 'regional.finos.gov.in']
  },
  {
    role: 'PROJECT_MANAGER',
    title: 'Project Manager',
    hierarchyLevel: 2,
    department: 'Project Execution & Budget Operations',
    primaryDomain: 'manager.finos.gov.in',
    allowedDomains: ['manager.finos.gov.in', 'pm.finos.gov.in']
  },
  {
    role: 'OPERATIONS_MANAGER',
    title: 'Operations Manager / Team Lead',
    hierarchyLevel: 2,
    department: 'Field Operations & Dispatch Control',
    primaryDomain: 'ops.finos.gov.in',
    allowedDomains: ['ops.finos.gov.in', 'manager.finos.gov.in']
  },
  {
    role: 'HR_MANAGER',
    title: 'Human Resources (HR) Manager',
    hierarchyLevel: 2,
    department: 'Personnel & Organizational Governance',
    primaryDomain: 'hr.finos.gov.in',
    allowedDomains: ['hr.finos.gov.in', 'manager.finos.gov.in']
  },
  {
    role: 'SITE_INCHARGE',
    title: 'Site Incharge / Field Engineer',
    hierarchyLevel: 1,
    department: 'On-Site Field Construction Team',
    primaryDomain: 'site.finos.gov.in',
    allowedDomains: ['site.finos.gov.in', 'field.finos.gov.in']
  }
];

export interface RegisteredAccount {
  email: string;
  passwordHash: string; // Stored plaintext for demo validation
  fullName: string;
  batchNo: string;
  role: UserRole;
  roleTitle: string;
  hierarchyLevel: number;
  department: string;
}

const DEFAULT_SEEDED_ACCOUNTS: RegisteredAccount[] = [
  {
    email: 'ceo@ceo.finos.gov.in',
    passwordHash: 'Pass@1234',
    fullName: 'Chief Executive Officer',
    batchNo: 'EXEC-HQ-9041',
    role: 'CEO',
    roleTitle: 'Chief Executive Officer (CEO)',
    hierarchyLevel: 4,
    department: 'Executive Cabinet & Capital Allocation'
  },
  {
    email: 'director@director.finos.gov.in',
    passwordHash: 'Pass@1234',
    fullName: 'Regional Director',
    batchNo: 'DIR-HQ-7732',
    role: 'DIRECTOR',
    roleTitle: 'Regional Director / Higher Official',
    hierarchyLevel: 3,
    department: 'Infrastructure & Regional Governance'
  },
  {
    email: 'manager@manager.finos.gov.in',
    passwordHash: 'Pass@1234',
    fullName: 'Project Operations Manager',
    batchNo: 'MGR-OPS-6611',
    role: 'PROJECT_MANAGER',
    roleTitle: 'Project Manager',
    hierarchyLevel: 2,
    department: 'Project Execution & Budget Operations'
  },
  {
    email: 'site@site.finos.gov.in',
    passwordHash: 'Pass@1234',
    fullName: 'Site Field Lead',
    batchNo: 'FLD-SITE-5544',
    role: 'SITE_INCHARGE',
    roleTitle: 'Site Incharge / Field Engineer',
    hierarchyLevel: 1,
    department: 'On-Site Field Construction Team'
  }
];

interface AuthContextType {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
  registeredAccounts: RegisteredAccount[];
  registerAccount: (account: RegisteredAccount) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('finos_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.fullName &&
          parsed.roleTitle &&
          typeof parsed.hierarchyLevel === 'number' &&
          parsed.batchNo
        ) {
          return parsed;
        }
      } catch (e) {
        console.error('Invalid saved user profile in localStorage:', e);
      }
    }
    localStorage.removeItem('finos_user');
    return null;
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('finos_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse registered accounts:', e);
      }
    }
    localStorage.setItem('finos_accounts', JSON.stringify(DEFAULT_SEEDED_ACCOUNTS));
    return DEFAULT_SEEDED_ACCOUNTS;
  });

  const login = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('finos_user', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finos_user');
  };

  const registerAccount = (acc: RegisteredAccount) => {
    const updated = [...registeredAccounts, acc];
    setRegisteredAccounts(updated);
    localStorage.setItem('finos_accounts', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        registeredAccounts,
        registerAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
