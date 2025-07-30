export const parseDate = (str) => {
  const [day, month, year] = str.split("-");
  return new Date(`${year}-${month}-${day}`); // ISO format: YYYY-MM-DD
};

export const monthMap = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};
