'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

import { ColumnDef } from '@tanstack/react-table';
import useApi from '../../../actions/useApi';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Preferences By Location', link: '/dashboard/preferences_location' }
];

interface AggregatedPreferencesByLocation {
  [location: string]: {
    [category: string]: {
      likes: { [item: string]: number };
      dislikes: { [item: string]: number };
    };
  };
}

export default function PreferencesPage() {
  const {
    data: apiData,
    isLoading,
    error
  } = useApi('user/preferences/location');
  const data: AggregatedPreferencesByLocation = apiData;
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
        <Heading title="User Preferences by Location" description="" />
        <div className="text-center text-lg">
          <p>📍 Click on each location to view detailed preferences.</p>
        </div>
        <Accordion type="multiple">
          {Object.entries(data).map(([location, categories]) => (
            <AccordionItem key={location} value={location}>
              <AccordionTrigger className="rounded-md  px-4 py-2 shadow-2xl hover:bg-gray-400">
                {location}
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                {Object.entries(categories).map(([category, prefs]) => (
                  <div key={category} className="mb-6">
                    <Heading
                      title={
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }
                      description=""
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Card className="border shadow-md">
                        <CardHeader>
                          <CardTitle>Likes</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-64 overflow-auto">
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
                      <Card className="border shadow-md">
                        <CardHeader>
                          <CardTitle>Dislikes</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-64 overflow-auto">
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageContainer>
  );
}
