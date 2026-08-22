'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { StudentSession } from './AuthProvider'; // import the type

// Re-use the same context so useAuth works!
// Wait, we can't easily re-use the exact same Context object unless it's exported.
