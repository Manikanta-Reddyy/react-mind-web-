export const fetchTemperature = async (
    lat: number,
    lon: number,
    date: string,
    hours: number[]
  ): Promise<number[]> => {
    const start_date = date;
    const end_date = date;
  
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start_date}&end_date=${end_date}&hourly=temperature_2m`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
  
      const json = await res.json();
      const temps: number[] = [];
  
      const timeArr: string[] = json?.hourly?.time || [];
      const tempArr: number[] = json?.hourly?.temperature_2m || [];
  
      if (timeArr.length === 0 || tempArr.length === 0) return [];
  
      hours.forEach((hour) => {
        const targetTime = `${date}T${hour.toString().padStart(2, "0")}:00`;
        const index = timeArr.indexOf(targetTime);
        if (index !== -1) temps.push(tempArr[index]);
      });
  
      return temps;
    } catch (err) {
      console.error("❌ Failed to fetch temperature:", err);
      return [];
    }
  };
  