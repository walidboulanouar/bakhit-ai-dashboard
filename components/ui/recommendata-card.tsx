// components/RecommendationCard.tsx

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

interface Recommendation {
  insight: string;
  action: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendation
}) => {
  return (
    <Card className="flex flex-col p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="flex items-center space-x-2">
        <LightBulbIcon className="h-6 w-6 text-yellow-500" />
        <h3 className="text-lg font-semibold">Insight</h3>
      </CardHeader>
      <CardContent className="mt-2">
        <p className="text-center text-lg text-gray-700">{recommendation.insight}</p>
      </CardContent>
      <CardHeader className="mt-4 flex items-center space-x-2">
        <CheckCircleIcon className="h-6 w-6 text-green-500" />
        <h3 className="text-lg  font-semibold">Action</h3>
      </CardHeader>
      <CardContent className="mt-2">
        <p className="text-xl text-center text-gray-700">{recommendation.action}</p>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
