'use client';

import useApi from '@/actions/useApi'; // Assuming you have a hook for API calls
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Spinner } from '../ui/spinner';

// Define the chart configuration
const chartConfig = {
  userGrowth: {
    label: 'New Users',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const { isLoading, data: apiData, error } = useApi('user/statistics/all'); // Use your API endpoint
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>('userGrowth');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (apiData && apiData.userGrowthOverTime) {
      // Map the API data into the required format for the chart
      const formattedData = apiData.userGrowthOverTime.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        userGrowth: item.count
      }));
      setChartData(formattedData);
    }
  }, [apiData]);

  if (isLoading) {
    return <Spinner />;
  }
  if (error) return <div>Error loading chart data</div>;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - New Users Over Time</CardTitle>
          <CardDescription>Showing new users for the past days</CardDescription>
        </div>
        <div className="flex">
          {['userGrowth'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {apiData?.userGrowthOverTime
                    .reduce((acc: number, curr: any) => acc + curr.count, 0)
                    .toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="userGrowth"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
