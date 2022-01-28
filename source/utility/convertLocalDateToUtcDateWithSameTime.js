/**
 * Returns a new `date` that shows the same time in UTC+0 time zone
 * as the original `date` does in the user's time zone.
 * For example, if the user is in Moscow (UTC+3 time zone)
 * and the `date` shows `12:00` on the clock, then this function
 * returns a new date whose time is `12:00` in UTC+0 time zone
 * or `15:00` in the user's time zone.
 * @param  {Date} date
 * @return {Date}
 */
export default function convertLocalDateToUtcDateWithSameTime(date) {
  // Doesn't account for leap seconds but I guess that's ok
  // given that javascript's own `Date()` does not either.
  // https://www.timeanddate.com/time/leap-seconds-background.html
  //
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  //
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}
