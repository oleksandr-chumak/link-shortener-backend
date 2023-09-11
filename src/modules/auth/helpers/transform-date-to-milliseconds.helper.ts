type DateIndicators = 's' | 'm' | 'd' | 'h' | 'w';
const dateIndicatorsArray = ['s', 'm', 'd', 'h', 'w'];
const dateIndicators: Record<DateIndicators, number> = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
};

export const transformDateToMilliseconds = (date: string) => {
  const invalidDateFormatError = new Error('Invalid date format');

  if (date.length < 2) {
    throw invalidDateFormatError;
  }

  const lastIndex = date.length - 1;
  const dateIndicator = date[lastIndex];
  const numericValue = Number(date.slice(0, lastIndex));

  if (
    Number.isNaN(numericValue) ||
    !dateIndicatorsArray.includes(dateIndicator)
  ) {
    throw invalidDateFormatError;
  }

  return numericValue * dateIndicators[dateIndicator];
};
