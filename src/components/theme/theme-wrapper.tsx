'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

export function ThemeWrapper({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
}