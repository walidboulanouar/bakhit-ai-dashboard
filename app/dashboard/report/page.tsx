// app/user/preferences/report/page.tsx

'use client';

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

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useApi from '../../../actions/useApi';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import RecommendationCard from '../../../components/ui/recommendata-card';
import { Spinner } from '../../../components/ui/spinner';
import { toast } from '../../../components/ui/use-toast';
import {
  LocationTrendsItem,
  PreferenceCorrelation,
  Recommendation,
  ReportData,
  SeasonalInfluence,
  UserSegmentationItem
} from '../../../constants/data';
import PageContainer from '../../../components/layout/page-container';

// Define columns for DataTables
const userSegmentationColumns: ColumnDef<UserSegmentationItem, any>[] = [
  {
    accessorKey: 'persona',
    header: 'Persona'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'preferences',
    header: 'Preferences',
    cell: (
      { getValue }: any // Use appropriate types here
    ) => (
      <ul className="list-inside list-disc">
        {(getValue() as string[]).map((pref) => (
          <li key={pref}>{pref}</li>
        ))}
      </ul>
    )
  },
  {
    accessorKey: 'dislikes',
    header: 'Dislikes',
    cell: ({ getValue }) => (
      <ul className="list-inside list-disc">
        {getValue<string[]>().map((dislike) => (
          <li key={dislike}>{dislike}</li>
        ))}
      </ul>
    )
  }
];

const locationTrendsColumns: ColumnDef<LocationTrendsItem, any>[] = [
  {
    accessorKey: 'location',
    header: 'Location'
  },
  {
    accessorKey: 'uniquePreferences',
    header: 'Unique Preferences',
    cell: ({ getValue }) => (
      <ul className="list-inside list-disc">
        {getValue<string[]>().map((pref) => (
          <li key={pref}>{pref}</li>
        ))}
      </ul>
    )
  },
  {
    accessorKey: 'correlations',
    header: 'Correlations',
    cell: ({ getValue }) => (
      <ul className="list-inside list-disc">
        {getValue<PreferenceCorrelation[]>().map((corr, index) => (
          <li key={index}>
            {corr.preferenceA} ↔ {corr.preferenceB}
          </li>
        ))}
      </ul>
    )
  }
];

// Define columns for Seasonal Influences
const seasonalInfluencesColumns: ColumnDef<SeasonalInfluence, any>[] = [
  {
    accessorKey: 'season',
    header: 'Season'
  },
  {
    accessorKey: 'influence',
    header: 'Influence'
  }
];

// Define columns for Preference Correlations
const preferenceCorrelationsColumns: ColumnDef<PreferenceCorrelation, any>[] = [
  {
    accessorKey: 'preferenceA',
    header: 'Preference A'
  },
  {
    accessorKey: 'preferenceB',
    header: 'Preference B'
  }
];

// Define columns for Recommendations
const recommendationsColumns: ColumnDef<Recommendation, any>[] = [
  {
    accessorKey: 'insight',
    header: 'Insight'
  },
  {
    accessorKey: 'action',
    header: 'Action'
  }
];

const behavioralPatternsColumns = [
  {
    accessorKey: 'season',
    header: 'Season'
  },
  {
    accessorKey: 'influence',
    header: 'Influence'
  }
];

export default function ReportPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    error: apiError
  } = useApi('user/preferences/report');
  const [generating, setGenerating] = useState<boolean>(false);

  // Handle Generate Report
  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + 'ai/analyze-preferences',
        {
          method: 'GET' // Adjust method if necessary
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }

      console.log('response', response);
      const result = await response.json();
      if (result.success) {
        toast({
          title: 'Report Generated',
          description: 'The report has been successfully generated.'
        }); // Refetch the report data after generation
      } else {
        throw new Error(result.message || 'Failed to generate report');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.message || 'An error occurred while generating the report.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };
  const reportData = data as ReportData;
  if (isLoading) {
    return (
      <div className="mt-20 text-center">
        <Spinner />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="mt-20 text-center text-red-500">Error: {apiError}</div>
    );
  }

  if (!reportData) {
    return <div className="mt-20 text-center">No report data available.</div>;
  }

  const { aiResponse } = reportData;
  const {
    userSegmentation,
    locationTrends,
    behavioralPatterns,
    recommendations
  } = aiResponse;

  const cost = reportData.cost;

  // Define breadcrumb items
  const breadcrumbItems = [
    { title: 'Home', link: '/' },
    { title: 'Preferences', link: '/dashboard/preferences' },
    { title: 'Report', link: '/user/preferences/report' }
  ];

  return (
    <PageContainer scrollable={true}>
    <div className="p-4 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <Heading
        title="User Preferences Report"
        description="Detailed analysis of users preferences, trends, and actionable insights."
      />
      <div className="mb-6 mt-4 flex items-center justify-between rounded-md bg-gray-100 p-4">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Report Cost:</span> {cost}$
          </p>
          <p className="text-xs text-gray-500">
            Generating a report costs approximately{' '}
            <span className="font-semibold">0.01$</span>.
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="rounded bg-amber-800 px-4 py-2 font-bold text-white hover:bg-amber-700"
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* User Segmentation Section */}
      <Accordion type="single" className="mt-6">
        <AccordionItem
          value="user-segmentation"
          className="rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
        >
          <AccordionTrigger>User Segmentation</AccordionTrigger>
          <AccordionContent>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Personas</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userSegmentationColumns}
                  data={userSegmentation}
                  searchKey="persona"
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-6" />

      {/* Location Trends Section */}
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem
          value="location-trends"
          className="rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
        >
          <AccordionTrigger>Location Trends</AccordionTrigger>
          <AccordionContent>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Unique Preferences by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={locationTrendsColumns}
                  data={locationTrends}
                  searchKey="location"
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-6" />

      {/* Behavioral Patterns Section */}
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem
          value="behavioral-patterns"
          className="rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
        >
          <AccordionTrigger>Behavioral Patterns</AccordionTrigger>
          <AccordionContent>
            {/* Seasonal Influences */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Seasonal Influences</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={behavioralPatternsColumns}
                  data={behavioralPatterns.seasonalInfluences}
                  searchKey="season"
                />
              </CardContent>
            </Card>

            {/* Preference Correlations */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Preference Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={preferenceCorrelationsColumns}
                  data={behavioralPatterns.preferenceCorrelations}
                  searchKey="preferenceA"
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-6" />

      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem
          value="recommendations"
          className="rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
        >
          <AccordionTrigger>Recommendations</AccordionTrigger>
          <AccordionContent>
            <Card className="mb-4 p-4">
              <CardHeader>
                <CardTitle>Actionable Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec, index) => (
                    <RecommendationCard key={index} recommendation={rec} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    </PageContainer>
  );
}
