import { getTodayLivePanchangServer, getVratCalendarServer } from '@/lib/panchang-server';
import PanchangClient from '@/components/Panchang/PanchangClient';

export default async function PanchangPage() {
  const [todayData, calendarData] = await Promise.all([
    getTodayLivePanchangServer(),
    getVratCalendarServer(2026),
  ]);

  return <PanchangClient initialToday={todayData} initialCalendar={calendarData} />;
}