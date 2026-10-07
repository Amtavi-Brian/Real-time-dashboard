import PropTypes from 'prop-types'

export default function AttendanceTable({ rows }) {
  return <tbody>{rows.map((record) => <tr key={record.date}><td>{record.date}</td><td><span className="attendance-present">{record.present}</span></td><td><span className="attendance-absent">{record.absent}</span></td><td>{record.late}</td><td>{record.workingHours.toLocaleString()} hrs</td></tr>)}</tbody>
}

AttendanceTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired }