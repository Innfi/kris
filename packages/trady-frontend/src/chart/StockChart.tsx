import React from 'react';
import { ApexOptions } from 'apexcharts';
import ApexCharts from 'react-apexcharts';
import { Typography } from '@mui/material';

import { StockData } from '../state/model';

const options: ApexOptions = {
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
};

const StockChart = (props: Readonly<StockData>) => {
  const { symbol, interval, snapshotMins } = props;
  // console.log(`StockChart] symbol: ${symbol}`);
  // console.log(`StockChart] interval: ${interval}`);
  // console.log(`StockChart] snapshotMins: ${JSON.stringify(snapshotMins)}`);

  return (
    <div className="stockChart">
      <Typography variant="h3" gutterBottom component="div">
        {symbol}
        {' '}
        /
        {interval}
      </Typography>
      <ApexCharts
        options={options}
        series={snapshotMins}
        type="candlestick"
        height={550}
        width={700}
      />
    </div>
  );
};

export default StockChart;
