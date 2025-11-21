import { useState, useEffect } from 'react'

interface Address {
  address_area_id: string
  address_name: string
  address_region_id: string | null
}

interface AddressSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ value, onChange, placeholder = '请选择地址' }) => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:3001/api/addresses')
      const result = await response.json()
      
      if (result.success) {
        setAddresses(result.data)
      } else {
        setError(result.message || '获取地址列表失败')
      }
    } catch (err) {
      console.error('获取地址列表错误:', err)
      setError('获取地址列表失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  if (loading) {
    return (
      <div className="form-group">
        <select disabled>
          <option value="">加载中...</option>
        </select>
      </div>
    )
  }

  if (error) {
    return (
      <div className="form-group">
        <select disabled>
          <option value="">{error}</option>
        </select>
      </div>
    )
  }

  return (
    <div className="form-group">
      <select
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        <option value="">{placeholder}</option>
        {addresses.map((address) => (
          <option key={address.address_area_id} value={address.address_area_id}>
            {address.address_name} ({address.address_area_id})
          </option>
        ))}
      </select>
    </div>
  )
}

export default AddressSelector