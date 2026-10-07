import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'

export default function DepartmentChart({ data }) {
  return <div className="chart-container department-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 2, right: 18, left: 0, bottom: 0 }}><CartesianGrid horizontal={false} stroke="var(--chart-grid)" strokeDasharray="3 4" /><XAxis type="number" domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} tickFormatter={(value) => `${value}%`} /><YAxis type="category" dataKey="name" width={95} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} /><Tooltip formatter={(value) => [`${value}%`, 'Attendance']} contentStyle={{ borderRadius: 6, borderColor: 'var(--border)', background: 'var(--panel)' }} /><Bar dataKey="attendanceRate" fill="#247f78" radius={[0, 3, 3, 0]} maxBarSize={13} /></BarChart></ResponsiveContainer></div>
}

DepartmentChart.propTypes = { data: PropTypes.arrayOf(PropTypes.object).isRequired }