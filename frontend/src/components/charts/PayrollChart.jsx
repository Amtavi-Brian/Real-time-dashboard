import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'

export default function PayrollChart({ data }) {
  return <div className="chart-container"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 8, left: -15, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} tickFormatter={(value) => `${value}`} /><Tooltip formatter={(value, name) => [`GHS ${value}m`, name]} contentStyle={{ borderRadius: 6, borderColor: 'var(--border)', background: 'var(--panel)' }} /><Bar dataKey="basic" name="Basic wages" stackId="payroll" fill="#247f78" radius={[0, 0, 0, 0]} /><Bar dataKey="overtime" name="Overtime" stackId="payroll" fill="#e4a35f" /><Bar dataKey="benefits" name="Benefits" stackId="payroll" fill="#7ba6c4" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
}

PayrollChart.propTypes = { data: PropTypes.arrayOf(PropTypes.object).isRequired }