import { Link } from 'react-router'
import './link-button.scss'

interface LinkButtonProps {
    readonly label: string
    readonly id?: string
    readonly className?: string
    readonly to: string
    readonly target?: React.HTMLAttributeAnchorTarget
}

export const LinkButton = ({ label, id, className, to, target }: LinkButtonProps) => (
    <Link
        id={id}
        className={`link-button${className ? ` ${className}` : ''}`}
        to={to}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
        {label}
    </Link>
)
