import { getUserOnboardingStatus } from '@/actions/user'
import { getIndustryInsights } from '@/actions/dashboard'
import React from 'react'
import DashboardView from './_components/DashboardView';
import { redirect } from 'next/navigation'

const Dashboard = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect('/onboarding');
  }

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  )
}

export default Dashboard