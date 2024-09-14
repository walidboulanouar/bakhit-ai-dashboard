'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

import { ColumnDef } from '@tanstack/react-table';
import useApi from '../../../actions/useApi';

interface AggregatedPreferences {
  [category: string]: {
    likes: { [item: string]: number };
    dislikes: { [item: string]: number };
  };
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Preferences', link: '/dashboard/preferences' }
];

export default function PreferencesAllPage() {
  const { data: apiData, isLoading, error } = useApi('user/preferences/all');
  const data: AggregatedPreferences = apiData;
  if (isLoading) {
    return (
      <PageContainer scrollable={true}>
        <div className="space-y-4">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer scrollable={true}>
        <div className="space-y-4">
          <Breadcrumbs items={breadcrumbItems} />
          <div>Error loading data.</div>
        </div>
      </PageContainer>
    );
  }

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: 'preference',
      header: 'Preference'
    },
    {
      accessorKey: 'count',
      header: 'Count'
    }
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Overall User Preferences" description="" />

        {Object.entries(data).map(([category, prefs]) => (
          <div key={category} className="mb-6">
            <Heading
              title={category.charAt(0).toUpperCase() + category.slice(1)}
              description=""
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Likes</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={columns}
                    data={Object.entries(prefs.likes).map(
                      ([preference, count]) => ({
                        preference,
                        count
                      })
                    )}
                    searchKey="preference"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Dislikes</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={columns}
                    data={Object.entries(prefs.dislikes).map(
                      ([preference, count]) => ({
                        preference,
                        count
                      })
                    )}
                    searchKey="preference"
                  />
                </CardContent>
              </Card>
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
