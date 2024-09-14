'use client';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { ClockIcon, SendHorizonalIcon, UsersIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useApi from '../../actions/useApi';
import { Spinner } from '../../components/ui/spinner';

export default function Page() {
  const { isLoading, data: apiData, error } = useApi('user/statistics/all');
  const { data: session, status } = useSession();
  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (error) {
    return (
      <PageContainer scrollable={true}>
        <div className="space-y-4">
          <div>Error loading data.</div>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi {session?.user?.name}, Welcome back to Bakhit AI 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Generate Report</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Analytics</TabsTrigger>
            {/* <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <UsersIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {apiData?.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Chatted with Bakhit
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Messages
                  </CardTitle>
                  <ChatBubbleIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Number(apiData?.totalMessages)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sent to Bakhit
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Response Time
                  </CardTitle>
                  <ClockIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Number(apiData?.averageResponseTime).toFixed(1)} seconds
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {apiData?.averageResponseTime < 1
                      ? 'Super fast replies!'
                      : apiData?.averageResponseTime < 5
                      ? 'Quick to respond'
                      : 'Taking a bit longer'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Messages Per User
                  </CardTitle>
                  <SendHorizonalIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Number(apiData?.avgMessagesPerUser)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {apiData?.avgMessagesPerUser < 1
                      ? 'Low engagement'
                      : apiData?.avgMessagesPerUser < 5
                      ? 'Moderate engagement'
                      : 'High engagement'}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Most Active users</CardTitle>
                  <CardDescription>
                    People loved to chat with Bakhit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
