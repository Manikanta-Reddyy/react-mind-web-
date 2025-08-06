// src/components/TimelineSlider/TimelineSlider.tsx

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

  const onChange = (value: number | [number, number]) => {
    setSelected(value);
  };

  return (
    <div className="component-box timeline-slider timeline-box" style={{ position: "relative" }}>
      <span className="section-label">Timeline</span>

      <div className="slider-header">
        <h3>Timeline Slider</h3>
        <Switch
          checkedChildren="Range"
          unCheckedChildren="Single"
          checked={mode === "range"}
          onChange={(checked) => setMode(checked ? "range" : "single")}
        />
      </div>

      <Slider
        range={mode === "range"}
        min={0}
        max={TOTAL_HOURS}
        value={mode === "range" ? (selected as [number, number]) : (selected as number)}
        onChange={onChange}
        step={1}
        marks={marks}
        tooltip={{ formatter: (val) => hourFromIndex(Number(val)) }}
        trackStyle={{ backgroundColor: "#f6a700", height: 6 }}
        handleStyle={
          mode === "range"
            ? [
                { backgroundColor: "#f6a700", borderColor: "#f6a700" },
                { backgroundColor: "#f6a700", borderColor: "#f6a700" },
              ]
            : { backgroundColor: "#f6a700", borderColor: "#f6a700" }
        }
      />

      <div className="time-labels">
        {mode === "single" ? (
          <p>Selected: {hourFromIndex(Number(selected))}</p>
        ) : (
          <p>
            Selected: {hourFromIndex((selected as [number, number])[0])} →{" "}
            {hourFromIndex((selected as [number, number])[1])}
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelineSlider;
