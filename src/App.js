import React from 'react';
import { Scene } from './components/scene';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  typography: {
    fontFamily: 'myFont',
    fontSize: 20
  },
  palette: {
    mode: 'dark'
  }
})

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Scene />
    </ThemeProvider>
  );
}

export default App;
