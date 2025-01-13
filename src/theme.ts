import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A6741',
      light: '#8AB77A',
      dark: '#3d5635',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#78909c',
      light: '#a7c0cd',
      dark: '#4b636e',
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#64748B',
      light: '#E2E8F0',
      dark: '#334155',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    error: {
      main: '#dc3545',
    },
    success: {
      main: '#28a745',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#4A6741',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 6px rgba(0,0,0,0.05)',
    '0 6px 8px rgba(0,0,0,0.05)',
    '0 8px 12px rgba(0,0,0,0.05)',
    '0 10px 14px rgba(0,0,0,0.05)',
    '0 12px 16px rgba(0,0,0,0.05)',
    '0 14px 18px rgba(0,0,0,0.05)',
    '0 16px 20px rgba(0,0,0,0.05)',
    '0 18px 22px rgba(0,0,0,0.05)',
    '0 20px 24px rgba(0,0,0,0.05)',
    '0 22px 26px rgba(0,0,0,0.05)',
    '0 24px 28px rgba(0,0,0,0.05)',
    '0 26px 30px rgba(0,0,0,0.05)',
    '0 28px 32px rgba(0,0,0,0.05)',
    '0 30px 34px rgba(0,0,0,0.05)',
    '0 32px 36px rgba(0,0,0,0.05)',
    '0 34px 38px rgba(0,0,0,0.05)',
    '0 36px 40px rgba(0,0,0,0.05)',
    '0 38px 42px rgba(0,0,0,0.05)',
    '0 40px 44px rgba(0,0,0,0.05)',
    '0 42px 46px rgba(0,0,0,0.05)',
    '0 44px 48px rgba(0,0,0,0.05)',
    '0 46px 50px rgba(0,0,0,0.05)',
    '0 48px 52px rgba(0,0,0,0.05)',
  ],
});

export default theme; 