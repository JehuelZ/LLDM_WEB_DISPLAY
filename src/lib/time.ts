
/**
 * Returns a Date object that reflects the current time in the church's local timezone.
 * We use the 'weatherTimezone' setting as the source of truth for the system's "Local Time".
 * @param timezone The IANA timezone string (e.g. 'America/Los_Angeles')
 */
export const getChurchDate = (timezone: string = 'UTC'): Date => {
  const now = new Date();
  try {
    // We want a date whose local methods (getHours, etc.) return the church time.
    // Using Intl.DateTimeFormat to get the string representation in that timezone
    // and then creating a new Date object from it.
    const churchStr = now.toLocaleString('en-US', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    // The format returned is MM/DD/YYYY, HH:mm:ss
    // We need to parse it correctly
    const [datePart, timePart] = churchStr.split(', ');
    const [month, day, year] = datePart.split('/');
    return new Date(`${year}-${month}-${day}T${timePart}`);
  } catch (e) {
    console.error("Time Sync Error: Invalid timezone provided:", timezone);
    return now;
  }
};

/**
 * Helper to get church now from store settings
 */
export const getChurchNow = (settings?: any): Date => {
  return getChurchDate(settings?.weatherTimezone || 'UTC');
};

/**
 * Returns the current time string formatted for the church's timezone.
 */
export const getChurchTimeString = (timezone: string = 'UTC'): string => {
  try {
      return new Date().toLocaleTimeString('en-US', {
          timeZone: timezone,
          hour12: true,
          hour: '2-digit',
          minute: '2-digit'
      });
  } catch (e) {
      return new Date().toLocaleTimeString();
  }
};
