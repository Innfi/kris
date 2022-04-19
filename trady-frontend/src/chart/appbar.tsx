import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  styled,
  alpha,
  AppBar,
  InputBase,
  Box,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';

import { loadStatThunk } from 'src/state/reducks';

const Search = styled('div')(({ theme }) => {
  return {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  };
});

const SearchIconWrapper = styled('div')(({ theme }) => {
  return {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
});

const StyledInputBase = styled(InputBase)(({ theme }) => {
  return {
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  };
});

type ChangeEventType = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

const TradyAppBar = () => {
  const [topic, setTopic] = useState({
    symbol: '',
    interval: '60min',
  });

  const dispatch = useDispatch();

  const handleChangeSearch = (e: ChangeEventType) => {
    e.preventDefault();

    setTopic({ ...topic, symbol: e.target.value });
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { symbol } = topic;
    setTopic({ ...topic, symbol: '' });

    dispatch(loadStatThunk(symbol, topic.interval));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { sx: 'none', sm: 'block' } }}
          >
            Trady
          </Typography>
          <form
            onSubmit={(e) => {
              return handleSubmitSearch(e);
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => {
                  return handleChangeSearch(e);
                }}
              />
            </Search>
          </form>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TradyAppBar;
