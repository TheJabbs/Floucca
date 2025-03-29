"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysInMonth = getDaysInMonth;
exports.getDaysInMonthByDate = getDaysInMonthByDate;
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
function getDaysInMonthByDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    return new Date(year, month, 0).getDate();
}
//# sourceMappingURL=get_days_in_a_month.js.map