import { AlertTriangle, CalendarDays, CircleDollarSign, Clock3, Info } from 'lucide-react'
import PropTypes from 'prop-types'

const icons = { High: AlertTriangle, Medium: CircleDollarSign, Low: Info }

export default function AlertItem({ alert }) {
  const Icon = alert.type === 'Leave Alert' ? CalendarDays : alert.type.includes('Overtime') ? Clock3 : icons[alert.severity] || Info
  return <article className={`alert-item severity-${alert.severity.toLowerCase()}`}><div className="alert-symbol"><Icon size={17} /></div><div className="alert-copy"><div className="alert-title-row"><strong>{alert.title}</strong>{alert.unread && <i className="unread-dot" aria-label="Unread" />}</div><p>{alert.message}</p><div className="alert-meta"><span>{alert.department}</span><span>{alert.time}</span></div></div></article>
}

AlertItem.propTypes  =  { alert: PropTypes.shape({ type: PropTypes.string.isRequired, severity: PropTypes.string.isRequired, title: PropTypes.string.isRequired, message: PropTypes.string.isRequired, time: PropTypes.string.isRequired, department: PropTypes.string.isRequired, unread: PropTypes.bool }).isRequired }