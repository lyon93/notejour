import { format } from 'date-fns';

/**
 * Utility class for date formatting.
 */
class DateUtils {
  /**
   * Formats a date to 'MMMM yyyy' (e.g., 'October 2023').
   * @param {Date} date - The date to format.
   * @returns {string} - Formatted date string.
   */
  static formatMonthYear(date) {
    return format(date, 'MMMM yyyy');
  }

  /**
   * Formats a date to 'MMMM d, yyyy' (e.g., 'October 12, 2023').
   * @param {Date} date - The date to format.
   * @returns {string} - Formatted date string.
   */
  static formatFullDate(date) {
    return format(date, 'MMMM d, yyyy');
  }

  /**
   * Formats a date to 'yyyy-MM-dd' (e.g., '2023-10-12').
   * @param {Date} date - The date to format.
   * @returns {string} - Formatted date string.
   */
  static formatISODate(date) {
    return format(date, 'yyyy-MM-dd');
  }

  /**
   * Formats a date to 'MMMM d, yyyy' or returns an empty string if the date is null.
   * Useful for conditional formatting in JSX.
   * @param {Date|null} date - The date to format.
   * @returns {string} - Formatted date string or empty string.
   */
  static formatConditionalDate(date) {
    return date ? format(date, 'MMMM d, yyyy') : '';
  }
}

export default DateUtils;
