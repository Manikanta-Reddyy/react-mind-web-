import { Slider, Switch } from "antd";
import { useTimeStore } from "../../context/useStore";
import { format, addHours, subHours } from "date-fns";
import "./TimelineSlider.css";

const TOTAL_HOURS = 720;
const CENTER_INDEX = TOTAL_HOURS / 2;

const marks = {
  0: "-15d",
  180: "-7d",
  360: "Today",
  540: "+7d",
  720: "+15d",
};

const TimelineSlider = () => {
  const { mode, selected, setMode, setSelected } = useTimeStore();

  const baseDate = new Date();

  const hourFromIndex = (index: number) =>
    format(addHours(subHours(baseDate, CENTER_INDEX), index), "dd MMM yyyy HH:mm");

  const isRange = mode === "range";

  return (
    <div className="component-box timeline-slider timeline-box" style={{ position: "relative" }}>
      <span className="section-label">Timeline</span>

      <div className="slider-header">
        <h3>Timeline Slider</h3>
        <Switch
          checkedChildren="Range"
          unCheckedChildren="Single"
          checked={isRange}
          onChange={(checked) => setMode(checked ? "range" : "single")}
        />
      </div>

      {isRange ? (
        <Slider
          range
          min={0}
          max={TOTAL_HOURS}
          value={selected as [number, number]} // ✅ safely cast for range
          onChange={(val) => setSelected(val as [number, number])}
          step={1}
          marks={marks}
          tooltip={{ formatter: (val) => hourFromIndex(Number(val)) }}
          trackStyle={[{ backgroundColor: "#f6a700", height: 6 }]}
          handleStyle={[
            { backgroundColor: "#f6a700", borderColor: "#f6a700" },
            { backgroundColor: "#f6a700", borderColor: "#f6a700" },
          ]}
        />
      ) : (
        <Slider
          min={0}
          max={TOTAL_HOURS}
          value={selected as number} // ✅ safely cast for single
          onChange={(val) => setSelected(val as number)}
          step={1}
          marks={marks}
          tooltip={{ formatter: (val) => hourFromIndex(Number(val)) }}
          trackStyle={{ backgroundColor: "#f6a700", height: 6 }}
          handleStyle={{ backgroundColor: "#f6a700", borderColor: "#f6a700" }}
        />
      )}

      <div className="time-labels">
        {isRange ? (
          <p>
            Selected: {hourFromIndex((selected as [number, number])[0])} →{" "}
            {hourFromIndex((selected as [number, number])[1])}
          </p>
        ) : (
          <p>Selected: {hourFromIndex(selected as number)}</p>
        )}
      </div>
    </div>
  );
};

export default TimelineSlider;
