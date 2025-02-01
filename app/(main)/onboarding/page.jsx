import React from 'react'
import { industries } from '@/data/industries'
import OnboardingForm from './_components/OnboardingForm'

const Onboarding = () => {
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  )
}

export default Onboarding