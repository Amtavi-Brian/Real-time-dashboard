import KPICard from './KPICard.jsx'
import { Wallet } from 'lucide-react'
export default function PayrollCard({ value }) { return <KPICard label="Expected gross payroll" value={value} delta="+2.1%" note="October cycle" icon={Wallet} tone="blue" /> }