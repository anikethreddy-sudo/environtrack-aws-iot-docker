import { useEffect, useState } from "react";
import {
  Activity, Thermometer, Droplets, Wifi, RefreshCw,
  Cloud, Database, Server, CheckCircle2, AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid
} from "recharts";

export default function App() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReadings() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/readings");
      if (!response.ok) throw new Error("Unable to retrieve AWS sensor data");
      const data = await response.json();
      setReadings(data.readings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReadings();
    const timer = setInterval(loadReadings, 30000);
    return () => clearInterval(timer);
  }, []);

  const latest = readings[0];
  const average = (key) => readings.length
    ? (readings.reduce((sum, item) => sum + Number(item[key] || 0), 0) / readings.length).toFixed(1)
    : "--";

  const chartData = [...readings].reverse().map((item, index) => ({
    name: `Reading ${index + 1}`,
    temperature: Number(item.temperature),
    humidity: Number(item.humidity)
  }));

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Activity /></div>
          <div><strong>ENVIRON<span>TRACK</span></strong><small>INTELLIGENT IOT MONITORING</small></div>
        </div>
        <div className="live"><span /> AWS CLOUD CONNECTED</div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">CLOUD MONITORING PLATFORM / OVERVIEW</p>
          <h1>Environmental<br /><span>Intelligence.</span></h1>
          <p className="subtitle">Monitor temperature and humidity readings from your IoT device, powered by AWS cloud services.</p>
        </div>
        <div className="hero-art"><Cloud size={100} strokeWidth={1} /><Activity size={45} /></div>
      </section>

      <section className="section-heading">
        <div><h2>Live sensor overview</h2><p>Latest available readings from Amazon S3</p></div>
        <button onClick={loadReadings}><RefreshCw size={15} /> Refresh</button>
      </section>

      {error && <div className="notice error"><AlertTriangle size={18} /> {error}</div>}
      {loading && <p className="loading">Connecting to AWS cloud...</p>}

      <section className="metrics">
        <article className="metric-card">
          <div className="metric-label"><Thermometer /> TEMPERATURE</div>
          <div className="metric-value">{latest ? `${latest.temperature}�` : "--"}</div>
          <div className="metric-foot">Celsius � Latest reading</div>
        </article>
        <article className="metric-card">
          <div className="metric-label"><Droplets /> HUMIDITY</div>
          <div className="metric-value">{latest ? `${latest.humidity}%` : "--"}</div>
          <div className="metric-foot">Relative humidity � Latest</div>
        </article>
        <article className="metric-card">
          <div className="metric-label"><Activity /> AVG TEMPERATURE</div>
          <div className="metric-value">{average("temperature")}{readings.length ? "�" : ""}</div>
          <div className="metric-foot">Across retrieved readings</div>
        </article>
        <article className="metric-card">
          <div className="metric-label"><Database /> TOTAL READINGS</div>
          <div className="metric-value">{readings.length}</div>
          <div className="metric-foot">Stored records retrieved</div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-title"><div><h3>Sensor trends</h3><p>Temperature and humidity history</p></div><Activity /></div>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243b36" />
                <XAxis dataKey="name" stroke="#91aaa1" tick={{fontSize: 10}} />
                <YAxis stroke="#91aaa1" tick={{fontSize: 10}} />
                <Tooltip contentStyle={{background:"#102722",border:"1px solid #315148",borderRadius:10}} />
                <Line type="monotone" dataKey="temperature" stroke="#e7b66c" strokeWidth={3} dot={{r:3}} />
                <Line type="monotone" dataKey="humidity" stroke="#65c9b0" strokeWidth={3} dot={{r:3}} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="empty">Sensor readings will appear here when available.</div>}
        </article>

        <article className="panel device-panel">
          <div className="panel-title"><div><h3>Device information</h3><p>Connected sensor identity</p></div><Wifi /></div>
          <div className="device-visual"><Activity size={52} /></div>
          <h3 className="device-name">{latest?.device || "EnvironmentalESP32"}</h3>
          <p className="device-type">DHT11 Temperature & Humidity Sensor</p>
          <div className="device-status"><CheckCircle2 size={16} /> CLOUD PIPELINE CONFIGURED</div>
          <div className="device-detail"><span>Sensor</span><strong>{latest?.sensor || "DHT11"}</strong></div>
          <div className="device-detail"><span>Data source</span><strong>Amazon S3</strong></div>
          <div className="device-detail"><span>Latest status</span><strong>{latest?.status || "Awaiting data"}</strong></div>
        </article>
      </section>

      <section className="panel history">
        <div className="panel-title"><div><h3>Recent sensor readings</h3><p>Latest records retrieved from cloud storage</p></div><Database /></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>DEVICE</th><th>TEMPERATURE</th><th>HUMIDITY</th><th>SENSOR</th><th>STATUS</th><th>TIMESTAMP</th></tr></thead>
            <tbody>
              {readings.map((item, index) => (
                <tr key={item.timestamp || index}>
                  <td>{item.device}</td><td>{item.temperature} �C</td><td>{item.humidity}%</td>
                  <td>{item.sensor}</td><td><span className="status">{item.status}</span></td>
                  <td>{item.timestamp ? new Date(item.timestamp).toLocaleString() : "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!readings.length && !loading && <div className="empty">No sensor records found in AWS S3.</div>}
        </div>
      </section>

      <footer>
        <div><strong>ENVIRONTRACK</strong><p>IoT-Based Environmental Monitoring System</p></div>
        <div className="services"><span><Cloud /> AWS IoT Core</span><span><Server /> Lambda</span><span><Database /> S3</span></div>
        <p className="footer-note">Sensor readings in this demonstration are simulated.</p>
      </footer>
    </main>
  );
}
