export const fetchMockData = async (
  lat: number,
  lon: number,
  field: string,
  hours: number[]
): Promise<number[]> => {
  return hours.map((h) => {
    const base = field === "temperature2m" ? 22 : 50;
    const variation = Math.sin(h / 3) * 5 + Math.random() * 2;
    const locationOffset = (lat + lon) * 0.01;
    return parseFloat((base + variation + locationOffset).toFixed(1));
  });
};
