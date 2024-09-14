'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import useApi from '../../actions/useApi';
import { Spinner } from '../ui/spinner';

// Import your useApi hook
// Adjust the import path as needed

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  // Format date as 'Sep 2'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function AreaGraph() {
  const { data, isLoading, error } = useApi('user/statistics/messages');

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !data) {
    return <div>Error loading data</div>;
  }

  // Prepare the chart data
  const chartData = data.map((item: any) => ({
    date: formatDate(item.date),
    count: item.count
  }));

  const chartConfig = {
    count: {
      label: 'Messages',
      color: '#4F46E5' // Use your desired color here
    }
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages per Day</CardTitle>
        <CardDescription>
          Showing messages per day for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="#4F46E5" // Use your desired color here
              fillOpacity={0.4}
              stroke="#4F46E5" // Use your desired color here
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <div className="flex items-center gap-2 font-medium leading-none">
                People are chatting a lot <ChartBarIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData.length > 0 &&
                `${chartData[0].date} - ${
                  chartData[chartData.length - 1].date
                }`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
