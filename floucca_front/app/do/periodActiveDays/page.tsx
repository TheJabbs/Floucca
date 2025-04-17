import dynamic from 'next/dynamic';

const ManagePeriods = dynamic(() => import('@/components/managePeriod/managePeriod'), {
  ssr: false,
});

export default function PeriodActiveDaysPage() {
  return <ManagePeriods />;
}
