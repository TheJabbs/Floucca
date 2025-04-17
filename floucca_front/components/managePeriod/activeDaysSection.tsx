import React, { useState } from 'react';
import { getDaysInMonthByDate } from '../utils/dateUtils';

const ActiveDaysSection = () => {
  const [port, setPort] = useState('');
  const [gear, setGear] = useState('');
  const [activeDays, setActiveDays] = useState(28);
  const [selectedDate, setSelectedDate] = useState('');

  const maxDays = selectedDate ? getDaysInMonthByDate(selectedDate) : 31;

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val <= maxDays) setActiveDays(val);
  };

  return (
    <div>
      <h3>Set Active Days</h3>

      <label>
        Select Date:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      <label>
        Select Port:
        <input type="text" value={port} onChange={(e) => setPort(e.target.value)} />
      </label>

      <label>
        Select Gear:
        <input type="text" value={gear} onChange={(e) => setGear(e.target.value)} />
      </label>

      <label>
        Active Days:
        <input
          type="number"
          min={1}
          max={maxDays}
          value={activeDays}
          onChange={handleDaysChange}
        />
        <span> / {maxDays} max</span>
      </label>
    </div>
  );
};

export default ActiveDaysSection;
