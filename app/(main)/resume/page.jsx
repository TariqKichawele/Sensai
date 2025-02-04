import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder'
import { getResume } from '@/actions/resume'

const Resume = async () => {
    const resume = await getResume();
  return (
    <div className="container mx-auto py-6">
        <ResumeBuilder initialContent={resume?.content} />
    </div>
  )
}

export default Resume