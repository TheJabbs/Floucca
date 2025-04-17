import React, { useState } from 'react';
import PeriodList from './periodList';
import ActiveDaysSection from './activeDaysSection';

const ManagePeriod = () => {
  const [showActiveDays, setShowActiveDays] = useState(true);

  return (
    <div>
      <h2>Manage Periods</h2>

      <button onClick={() => setShowActiveDays((prev) => !prev)}>
        {showActiveDays ? 'Hide Active Days Section' : 'Show Active Days Section'}
      </button>

      {showActiveDays && <ActiveDaysSection />}
      <PeriodList />
    </div>
  );
};

export default ManagePeriod;
