import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'

export default function KPICard({ label, value, delta, note, icon: Icon, tone = 'blue' }) {
  const previous = useRef(value)
  const [changed, setChanged] = useState(false)
  useEffect(() => {
    if (previous.current !== value) {
      setChanged(true)
      const timer = window.setTimeout(() => setChanged(false), 850)
      previous.current = value
      return () => window.clearTimeout(timer)
    }
  }, [value])
  return <article className={`kpi-card tone-${tone} ${changed ? 'metric-flash' : ''}`}><div className="kpi-top"><span>{label}</span><span className="kpi-icon"><Icon size={17} strokeWidth={1.8} /></span></div><div className="kpi-value" aria-live="polite">{value}</div><div className="kpi-foot"><span className="kpi-delta"><ArrowUpRight size={13} />{delta}</span><span>{note}</span></div></article>
}

KPICard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, delta: PropTypes.string.isRequired, note: PropTypes.string.isRequired, icon: PropTypes.elementType.isRequired, tone: PropTypes.string }