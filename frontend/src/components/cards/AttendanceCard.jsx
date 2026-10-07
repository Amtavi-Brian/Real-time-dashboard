import KPICard from './KPICard.jsx'
import { Activity } from 'lucide-react'
export default function AttendanceCard({ value }) { return <KPICard label="Attendance rate" value={`${value}%`} delta="+1.2%" note="vs last week" icon={Activity} tone="green" /> }