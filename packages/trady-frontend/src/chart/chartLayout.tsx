import React from 'react';
import { Grid, Paper, styled } from '@mui/material';

const Item = styled(Paper)(({ theme }) => {
  return {
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  };
});

const ChartLayout = () => {
  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 1 }}>
        <Grid item xs={2} sm={4} md={4} key={0} />
        <Grid item xs={2} sm={4} md={4} key={0}>
          <Item>xs=2</Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4} key={1}>
          <Item>xs=2</Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChartLayout;
