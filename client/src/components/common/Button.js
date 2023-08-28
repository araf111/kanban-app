const Button = ({ type = 'submit', className, ...props }) => (
    <button
        type={type}
        className={`${className}`}
        style={{
            color: '#fff', 
            padding: '4px 12px', 
            backgroundColor: 'green',
            fontWeight: '700',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '0px 3px'
        }}
        {...props}
    />
)

export default Button
