import "./Sidebar.css";
import { usePolygonStore } from "../../context/usePolygonStore";

const Sidebar = () => {
  const selectedId = usePolygonStore((s) => s.selectedId);
  const polygonConfigs = usePolygonStore((s) => s.polygonConfigs);
  const updateConfig = usePolygonStore((s) => s.updateConfig);

  const config = polygonConfigs[selectedId!] || {
    dataSource: "Open-Meteo",
    field: "temperature_2m",
    rules: [{ operator: "<", value: 10, color: "#ff0000" }],
  };

  const update = (newConfig: Partial<typeof config>) => {
    updateConfig(selectedId!, { ...config, ...newConfig });
  };

  const handleRuleChange = (index: number, key: string, newValue: any) => {
    const updatedRules = [...config.rules];
    (updatedRules[index] as any)[key] = newValue;
    update({ rules: updatedRules });
  };

  const addRule = () => {
    update({
      rules: [...config.rules, { operator: "=", value: 0, color: "#999999" }],
    });
  };

  const deleteRule = (index: number) => {
    const filtered = config.rules.filter((_, i) => i !== index);
    update({ rules: filtered });
  };

  if (!selectedId) return null;

  return (
    <div className="sidebar">
      <h3>Configure Polygon</h3>

      <label>Data Source</label>
      <select value={config.dataSource} onChange={(e) => update({ dataSource: e.target.value })}>
        <option>Open-Meteo</option>
      </select>

      <label>Field</label>
      <select value={config.field} onChange={(e) => update({ field: e.target.value })}>
        <option>temperature_2m</option>
        <option>humidity_2m</option>
        <option>wind_speed_10m</option>
      </select>

      <label>Threshold Rules</label>
      <div className="rules-table">
        {config.rules.map((rule, index) => (
          <div key={index} className="rule-row">
            <select
              value={rule.operator}
              onChange={(e) => handleRuleChange(index, "operator", e.target.value)}
            >
              <option value="<">&lt;</option>
              <option value="<=">&le;</option>
              <option value="=">=</option>
              <option value=">">&gt;</option>
              <option value=">=">&ge;</option>
            </select>

            <input
              type="number"
              value={rule.value}
              onChange={(e) => handleRuleChange(index, "value", +e.target.value)}
            />

            <input
              type="color"
              value={rule.color}
              onChange={(e) => handleRuleChange(index, "color", e.target.value)}
            />

            <button onClick={() => deleteRule(index)}>✕</button>
          </div>
        ))}
      </div>

      <button onClick={addRule} className="add-rule-btn">+ Add Rule</button>
    </div>
  );
};

export default Sidebar;
