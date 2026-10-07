import PropTypes from 'prop-types'
import formatCurrency from '../../utils/formatCurrency.js'

export default function PayrollTable({ rows }) {
  return <tbody>{rows.map((row) => <tr key={row.department}><td>{row.department}</td><td>{formatCurrency(row.basicWages)}</td><td>{formatCurrency(row.overtimePay)}</td><td>{formatCurrency(row.gross)}</td><td>{formatCurrency(row.processed)}</td><td><strong className={row.variance ? 'variance-value' : ''}>{formatCurrency(row.variance)}</strong></td></tr>)}</tbody>
}

PayrollTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired }