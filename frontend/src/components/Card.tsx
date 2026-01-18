import type { ReactNode } from 'react'

interface CardProps{
    children: ReactNode,
    className?: string
}

const Card = ({children, className = ""}: CardProps) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
        {children}
    </div>
  )
}

export default Card;