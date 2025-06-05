import styles from "./styles.module.css"

const Input = ({ 
  type, 
  placeholder, 
  value, 
  onChange = undefined, 
  onKeyDown = undefined, 
  color = "#2E3238", children }) => {
  return (
    <div className={styles.input_card} style={{ backgroundColor: color }}>
      {children}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown} required />
    </div>
  )
}

export default Input