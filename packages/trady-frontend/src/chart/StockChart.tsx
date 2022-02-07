import React from 'react';
import { ApexOptions } from 'apexcharts';
import ApexCharts from 'react-apexcharts';
import { Typography } from '@mui/material';

import { SnapshotMinimal, StockData } from '../state/model';

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

interface ApexSeriesUnit {
  data: SnapshotMinimal[];
}

const StockChart = (props: Readonly<StockData>) => {
  const { symbol, interval, snapshotMins } = props;
  const series: ApexSeriesUnit[] = [];
  series.push({ data: snapshotMins });
  // console.log(`StockChart] series: ${JSON.stringify(series)}`);

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
        series={series}
        type="candlestick"
        height={250}
        width={600}
      />
    </div>
  );
};

export default StockChart;
