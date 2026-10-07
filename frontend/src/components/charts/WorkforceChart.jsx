import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import PropTypes from 'prop-types'

const colors = ['#247f78', '#e4a35f', '#7ba6c4', '#d57867', '#8c9d72']

export default function WorkforceChart({ data }) {
  return <div className="workforce-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="93%" paddingAngle={3} stroke="none">{data.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value, name) => [`${value} people`, name]} contentStyle={{ borderRadius: 6, borderColor: 'var(--border)', background: 'var(--panel)' }} /></PieChart></ResponsiveContainer><div className="donut-total"><strong>264</strong><span>employees</span></div></div>
}

WorkforceChart.propTypes = { data: PropTypes.arrayOf(PropTypes.object).isRequired }