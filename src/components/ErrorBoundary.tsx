import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isOffline: !navigator.onLine
  };

  constructor(props: Props) {
    super(props);
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isOffline: !navigator.onLine };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.isOffline) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are currently offline. Some features may be limited.
          </Alert>
          <Typography variant="body1" gutterBottom>
            Don't worry! Your changes will be saved and synced when you're back online.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry Connection
          </Button>
        </Box>
      );
    }

    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {this.state.error?.message || 'Something went wrong'}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 