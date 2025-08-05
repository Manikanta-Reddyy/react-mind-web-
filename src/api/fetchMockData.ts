export const fetchMockData = async (
    lat: number,
    lon: number,
    field: string,
    hours: number[]
  ): Promise<number[]> => {
    return hours.map((h) => {
      const base = field === "temperature_2m" ? 22 : 50;
      const variation = Math.sin(h / 3) * 5 + Math.random() * 2;
      return parseFloat((base + variation).toFixed(1));
    });
  };