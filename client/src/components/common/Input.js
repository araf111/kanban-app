const Input = ({ disabled = false, className, ...props }) => (
    <input
        disabled={disabled}
        className={`${className}`}
        style={{
            padding:'3px',
            display: 'block',
            marginBottom: '12px',
            width: '220px',
            height: '25px',
        }}
        {...props}
    />
)

export default Input
