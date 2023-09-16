import React from 'react';
import './App.scss';

import { Link, Outlet } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box, CssBaseline, Paper } from '@mui/material';

function App() {
  const [value, setValue] = React.useState(0);
  
  return (
    <Box>
      <CssBaseline />
      <Outlet />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Recents" component={Link} to={"/home"} />
          <BottomNavigationAction label="Favorites" component={Link} to={"/another"}  />
          <BottomNavigationAction label="Nearby" component={Link} to={"/herres"} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default App;
