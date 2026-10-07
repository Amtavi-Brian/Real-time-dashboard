import KPICard from './KPICard.jsx'
import { Clock3 } from 'lucide-react'
export default function OvertimeCard({ value }) { return <KPICard label="Overtime hours" value={value} delta="+4.8%" note="vs last month" icon={Clock3} tone="amber" /> }