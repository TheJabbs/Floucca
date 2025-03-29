function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

function getDaysInMonthByDate(date: string): number {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    return new Date(year, month, 0).getDate();
}

export { getDaysInMonth, getDaysInMonthByDate };