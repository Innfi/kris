import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';

import { StockData } from 'src/state/model';
import StockChart from './stockChart';

// const Item = styled(Paper)(({ theme }) => {
//   return {
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   };
// });

const ChartLayout = () => {
  const stockStats: Readonly<StockData>[] = useSelector((state: any) => {
    return state.tradyReducer.stockStats;
  });

  useEffect(() => {
    console.log(`ChartLayout] len: ${stockStats.length}`);
  }, [stockStats]);

  if (stockStats.length <= 0) return <div>ready</div>;

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 1 }}>
        {stockStats.map((value: Readonly<StockData>) => {
          return (
            <StockChart
              symbol={value.symbol}
              interval={value.interval}
              snapshotMins={value.snapshotMins}
              key={value.symbol}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default ChartLayout;
