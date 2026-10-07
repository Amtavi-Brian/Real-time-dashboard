import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'

export default function OvertimeChart({ data }) {
  return <div className="chart-container"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 2, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" /><XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 9 }} interval={0} /><YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} /><Tooltip formatter={(value) => [`${value} hrs`, 'Overtime']} contentStyle={{ borderRadius: 6, borderColor: 'var(--border)', background: 'var(--panel)' }} /><Bar dataKey="hours" fill="#e4a35f" radius={[3, 3, 0, 0]} maxBarSize={35} /></BarChart></ResponsiveContainer></div>
}

OvertimeChart.propTypes = { data: PropTypes.arrayOf(PropTypes.object).isRequired }