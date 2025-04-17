export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
  
  export function getDaysInMonthByDate(date: string): number {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  }
  
  export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  