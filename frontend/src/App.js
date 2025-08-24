import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '0.05em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #e3eafc 0%, #fff 100%)' }}>
        <Typography variant="h1" color="primary" gutterBottom>
          Universal AI Assistant
        </Typography>
        <Typography variant="h2" color="secondary" gutterBottom>
          Posh, Rich, Formal & Super Modern
        </Typography>
        <Typography variant="body1">
          Welcome! This platform lets you interact with multiple AI models for chat, image generation, and more.
        </Typography>
        {/* Multi-Agent Chat UI */}
        <AgentChat />
      </Box>
    </ThemeProvider>
  );
}

export default App;
