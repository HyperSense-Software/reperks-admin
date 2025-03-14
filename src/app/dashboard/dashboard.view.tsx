'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { BriefcaseBusiness } from 'lucide-react';

import PageContainer from '@/components/ui/page-container';
import { CalendarDateRangePicker } from '@/components/date-range-picker/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  portfoliosCounterLoadingSelector,
  portfoliosCounterSelector,
} from '@/store/portfolios-counter/portfoliosCounter.selector';
import { getPortfoliosCounter } from '@/store/portfolios-counter/portfoliosCounter.thunk';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardView() {
  const dispatch = useAppDispatch();
  const portfoliosCounter = useAppSelector(portfoliosCounterSelector);
  const portfoliosCounterLoading = useAppSelector(portfoliosCounterLoadingSelector);

  useEffect(() => {
    dispatch(getPortfoliosCounter());
  }, [dispatch]);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Hi, Welcome back 👋</h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>

        <Card className="relative w-1/4 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-foreground font-bold">Projects</CardDescription>
            <BriefcaseBusiness />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-4xl font-bold">
              {portfoliosCounterLoading ? (
                <Skeleton className="h-[40px] w-[46px] rounded-xl" />
              ) : (
                portfoliosCounter
              )}
            </CardTitle>
            <div className="text-muted-foreground text-xs">Total number of projects</div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
