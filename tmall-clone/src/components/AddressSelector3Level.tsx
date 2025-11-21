import { useState, useEffect } from 'react'

interface Address {
  address_area_id: string
  address_name: string
  address_region_id: string | null
}

interface AddressSelector3LevelProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const AddressSelector3Level: React.FC<AddressSelector3LevelProps> = ({ 
  value, 
  onChange, 
  placeholder = '请选择地址' 
}) => {
  const [provinces, setProvinces] = useState<Address[]>([])
  const [cities, setCities] = useState<Address[]>([])
  const [districts, setDistricts] = useState<Address[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince)
    } else {
      setCities([])
      setDistricts([])
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity)
    } else {
      setDistricts([])
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedDistrict) {
      onChange(selectedDistrict)
    }
  }, [selectedDistrict, onChange])

  const fetchProvinces = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:3001/api/addresses')
      
      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setProvinces(result.data)
        console.log('获取到省份数据:', result.data.length, '个')
      } else {
        setError(result.message || '获取省份列表失败')
      }
    } catch (err) {
      console.error('获取省份列表错误:', err)
      setError(`获取省份列表失败: ${err.message}`)
      
      // 使用备用数据
      const fallbackProvinces = [
        { address_area_id: '110000', address_name: '北京市', address_region_id: null },
        { address_area_id: '310000', address_name: '上海市', address_region_id: null },
        { address_area_id: '440000', address_name: '广东省', address_region_id: null },
        { address_area_id: '320000', address_name: '江苏省', address_region_id: null },
        { address_area_id: '330000', address_name: '浙江省', address_region_id: null },
      ]
      setProvinces(fallbackProvinces)
      setError('使用备份数据 - 服务器连接失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async (provinceId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/addresses?parentId=${provinceId}`)
      const result = await response.json()
      
      if (result.success) {
        setCities(result.data)
        setSelectedCity('')
        setSelectedDistrict('')
      }
    } catch (err) {
      console.error('获取城市列表错误:', err)
    }
  }

  const fetchDistricts = async (cityId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/addresses?parentId=${cityId}`)
      const result = await response.json()
      
      if (result.success) {
        setDistricts(result.data)
        setSelectedDistrict('')
      }
    } catch (err) {
      console.error('获取区县列表错误:', err)
    }
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value)
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value)
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value)
  }

  if (loading) {
    return (
      <div className="form-group">
        <div className="address-selector-loading">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="form-group">
        <div className="address-selector-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="address-selector-3level">
      <div className="form-group">
        <label>省份:</label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="form-select"
        >
          <option value="">请选择省份</option>
          {provinces.map((province) => (
            <option key={province.address_area_id} value={province.address_area_id}>
              {province.address_name}
            </option>
          ))}
        </select>
      </div>

      {selectedProvince && (
        <div className="form-group">
          <label>城市:</label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="form-select"
          >
            <option value="">请选择城市</option>
            {cities.map((city) => (
              <option key={city.address_area_id} value={city.address_area_id}>
                {city.address_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCity && (
        <div className="form-group">
          <label>区县:</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="form-select"
          >
            <option value="">请选择区县</option>
            {districts.map((district) => (
              <option key={district.address_area_id} value={district.address_area_id}>
                {district.address_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default AddressSelector3Level