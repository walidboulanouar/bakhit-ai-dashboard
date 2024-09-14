'use client';

import { Label, Pie, PieChart } from 'recharts';

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
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import useApi from '../../actions/useApi';
import { Spinner } from '../ui/spinner';

// Import the useApi hook
// Adjust the import path as necessary

// Days of the week array
const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Static colors for each day
const dayColors = {
  Sunday: '#E53E3E', // Red
  Monday: '#DD6B20', // Orange
  Tuesday: '#D69E2E', // Yellow
  Wednesday: '#38A169', // Green
  Thursday: '#3182CE', // Blue
  Friday: '#805AD5', // Purple
  Saturday: '#D53F8C' // Pink
};

export function PieGraph() {
  const { data, isLoading, error } = useApi('user/statistics/messages');

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !data) {
    return <div>Error loading data</div>;
  }

  // Process data to aggregate counts per day of the week
  const messagesPerDay = data.reduce((acc: any, curr: any) => {
    const date = new Date(curr.date);
    const dayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayName = daysOfWeek[dayIndex];

    if (!acc[dayName]) {
      acc[dayName] = 0;
    }

    acc[dayName] += curr.count;

    return acc;
  }, {});

  // Convert messagesPerDay object to array for chartData
  const chartData = daysOfWeek.map((day: any) => ({
    day: day,
    messages: messagesPerDay[day] || 0,
    fill: dayColors[day as keyof typeof dayColors] || '#000000'
  }));

  // Calculate total messages
  const totalMessages = chartData.reduce((acc, curr) => acc + curr.messages, 0);

  // Create chartConfig for each day
  const chartConfig = {
    messages: {
      label: 'Messages'
    },
    ...daysOfWeek.reduce((acc: any, day: any) => {
      acc[day.toLowerCase()] = {
        label: day,
        color: dayColors[day as keyof typeof dayColors] || '#000000'
      };
      return acc;
    }, {})
  } satisfies ChartConfig;
  // Calculate total messages

  // Find the day with the highest messages
  const mostActiveDay = chartData.reduce((prev, current) => {
    return prev.messages > current.messages ? prev : current;
  });

  // Handle case when there are no messages
  const mostActiveDayName = mostActiveDay.day || 'no day';
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Messages by Day of the Week</CardTitle>
        <CardDescription>2 Sept - 12 Sept</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="messages"
              nameKey="day"
              innerRadius={60}
              strokeWidth={5}
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMessages.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Messages
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          People are chatting a lot {mostActiveDayName}
          <ChatBubbleBottomCenterIcon className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Messages per day of the week
        </div>
      </CardFooter>
    </Card>
  );
}
