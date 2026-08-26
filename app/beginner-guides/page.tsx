'use client';

import React from 'react';
import { getBeginnerGuideBySlug } from '@/lib/beginner-guides-data';
import BeginnerGuideDetailView from '@/components/BeginnerGuideDetail/BeginnerGuideDetailView';

export default function BeginnerGuidesIndexPage() {
  const guide = getBeginnerGuideBySlug('sundarkand-path');
  return <BeginnerGuideDetailView guide={guide} />;
}
