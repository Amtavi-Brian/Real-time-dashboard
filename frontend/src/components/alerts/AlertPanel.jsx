import PropTypes from 'prop-types'
import AlertItem from './AlertItem.jsx'

export default function AlertPanel({ alerts }) {
  if (!alerts.length) return <div className="empty-state compact-empty">No active alerts. All clear for now.</div>
  return <div className="alert-list">{alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)}</div>
}

AlertPanel.propTypes = { alerts: PropTypes.arrayOf(PropTypes.object).isRequired }