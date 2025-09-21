import React from 'react';

interface ResultsOverviewStatsProps {
  totalResponses: number;
  totalBeneficiaries: number;
  completionRate: number;
  averageCompletionTime: string;
  lastUpdated: Date;
}

export function ResultsOverviewStats({
  totalResponses,
  totalBeneficiaries,
  completionRate,
  averageCompletionTime,
  lastUpdated
}: ResultsOverviewStatsProps) {
  return null;
}