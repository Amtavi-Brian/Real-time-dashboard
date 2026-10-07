import PropTypes from 'prop-types'
import formatPercentage from '../../utils/formatPercentage.js'

export default function EmployeeTable({ rows, onSelect }) {
  return <tbody>{rows.map((employee) => <tr key={employee.id}><td><div className="employee-cell"><span className="employee-avatar">{employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{employee.name}</strong><small>{employee.id}</small></span></div></td><td>{employee.department}</td><td>{employee.title}</td><td>{formatPercentage(employee.attendanceRate)}</td><td><span className={`status-badge status-${employee.status.toLowerCase().replaceAll(' ', '-')}`}>{employee.status}</span></td><td><button className="text-action" onClick={() => onSelect(employee.id)}>View details</button></td></tr>)}</tbody>
}

EmployeeTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired, onSelect: PropTypes.func.isRequired }