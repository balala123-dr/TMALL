import { useState } from 'react'

interface AddressOption {
  code: string
  name: string
  children?: AddressOption[]
}

// 中国省市区数据（简化版）
const addressData: AddressOption[] = [
  {
    code: '110000',
    name: '北京市',
    children: [
      { code: '110100', name: '市辖区', children: [
        { code: '110101', name: '东城区' },
        { code: '110102', name: '西城区' },
        { code: '110105', name: '朝阳区' },
        { code: '110106', name: '丰台区' },
        { code: '110107', name: '石景山区' },
        { code: '110108', name: '海淀区' },
        { code: '110109', name: '门头沟区' },
        { code: '110111', name: '房山区' },
        { code: '110112', name: '通州区' },
        { code: '110113', name: '顺义区' },
        { code: '110114', name: '昌平区' },
        { code: '110115', name: '大兴区' },
        { code: '110116', name: '怀柔区' },
        { code: '110117', name: '平谷区' },
        { code: '110118', name: '密云区' },
        { code: '110119', name: '延庆区' },
      ]}
    ]
  },
  {
    code: '310000',
    name: '上海市',
    children: [
      { code: '310100', name: '市辖区', children: [
        { code: '310101', name: '黄浦区' },
        { code: '310104', name: '徐汇区' },
        { code: '310105', name: '长宁区' },
        { code: '310106', name: '静安区' },
        { code: '310107', name: '普陀区' },
        { code: '310109', name: '虹口区' },
        { code: '310110', name: '杨浦区' },
        { code: '310112', name: '闵行区' },
        { code: '310113', name: '宝山区' },
        { code: '310114', name: '嘉定区' },
        { code: '310115', name: '浦东新区' },
        { code: '310116', name: '金山区' },
        { code: '310117', name: '松江区' },
        { code: '310118', name: '青浦区' },
        { code: '310120', name: '奉贤区' },
        { code: '310151', name: '崇明区' },
      ]}
    ]
  },
  {
    code: '440000',
    name: '广东省',
    children: [
      { code: '440100', name: '广州市', children: [
        { code: '440103', name: '荔湾区' },
        { code: '440104', name: '越秀区' },
        { code: '440105', name: '海珠区' },
        { code: '440106', name: '天河区' },
        { code: '440111', name: '白云区' },
        { code: '440112', name: '黄埔区' },
        { code: '440113', name: '番禺区' },
        { code: '440114', name: '花都区' },
        { code: '440115', name: '南沙区' },
        { code: '440117', name: '从化区' },
        { code: '440118', name: '增城区' },
      ]},
      { code: '440300', name: '深圳市', children: [
        { code: '440303', name: '罗湖区' },
        { code: '440304', name: '福田区' },
        { code: '440305', name: '南山区' },
        { code: '440306', name: '宝安区' },
        { code: '440307', name: '龙岗区' },
        { code: '440308', name: '盐田区' },
        { code: '440309', name: '龙华区' },
        { code: '440310', name: '坪山区' },
        { code: '440311', name: '光明区' },
      ]},
      { code: '440400', name: '珠海市', children: [
        { code: '440402', name: '香洲区' },
        { code: '440403', name: '斗门区' },
        { code: '440404', name: '金湾区' },
      ]},
      { code: '440600', name: '佛山市', children: [
        { code: '440604', name: '禅城区' },
        { code: '440605', name: '南海区' },
        { code: '440606', name: '顺德区' },
        { code: '440607', name: '三水区' },
        { code: '440608', name: '高明区' },
      ]},
      { code: '441900', name: '东莞市', children: [
        { code: '441900', name: '东莞市' },
      ]},
      { code: '442000', name: '中山市', children: [
        { code: '442000', name: '中山市' },
      ]},
    ]
  },
  {
    code: '320000',
    name: '江苏省',
    children: [
      { code: '320100', name: '南京市', children: [
        { code: '320102', name: '玄武区' },
        { code: '320104', name: '秦淮区' },
        { code: '320105', name: '建邺区' },
        { code: '320106', name: '鼓楼区' },
        { code: '320111', name: '浦口区' },
        { code: '320113', name: '栖霞区' },
        { code: '320114', name: '雨花台区' },
        { code: '320115', name: '江宁区' },
        { code: '320116', name: '六合区' },
        { code: '320117', name: '溧水区' },
        { code: '320118', name: '高淳区' },
      ]},
      { code: '320200', name: '无锡市', children: [
        { code: '320205', name: '锡山区' },
        { code: '320206', name: '惠山区' },
        { code: '320211', name: '滨湖区' },
        { code: '320213', name: '梁溪区' },
        { code: '320214', name: '新吴区' },
        { code: '320281', name: '江阴市' },
        { code: '320282', name: '宜兴市' },
      ]},
      { code: '320400', name: '常州市', children: [
        { code: '320402', name: '天宁区' },
        { code: '320404', name: '钟楼区' },
        { code: '320411', name: '新北区' },
        { code: '320412', name: '武进区' },
        { code: '320413', name: '金坛区' },
        { code: '320481', name: '溧阳市' },
      ]},
      { code: '320500', name: '苏州市', children: [
        { code: '320505', name: '虎丘区' },
        { code: '320506', name: '吴中区' },
        { code: '320507', name: '相城区' },
        { code: '320508', name: '姑苏区' },
        { code: '320509', name: '吴江区' },
        { code: '320581', name: '常熟市' },
        { code: '320582', name: '张家港市' },
        { code: '320583', name: '昆山市' },
        { code: '320585', name: '太仓市' },
      ]},
    ]
  },
  {
    code: '330000',
    name: '浙江省',
    children: [
      { code: '330100', name: '杭州市', children: [
        { code: '330102', name: '上城区' },
        { code: '330105', name: '拱墅区' },
        { code: '330106', name: '西湖区' },
        { code: '330108', name: '滨江区' },
        { code: '330109', name: '萧山区' },
        { code: '330110', name: '余杭区' },
        { code: '330111', name: '富阳区' },
        { code: '330112', name: '临安区' },
        { code: '330113', name: '临平区' },
        { code: '330114', name: '钱塘区' },
        { code: '330122', name: '桐庐县' },
        { code: '330127', name: '淳安县' },
        { code: '330182', name: '建德市' },
      ]},
      { code: '330200', name: '宁波市', children: [
        { code: '330203', name: '海曙区' },
        { code: '330205', name: '江北区' },
        { code: '330206', name: '北仑区' },
        { code: '330211', name: '镇海区' },
        { code: '330212', name: '鄞州区' },
        { code: '330213', name: '奉化区' },
        { code: '330225', name: '象山县' },
        { code: '330226', name: '宁海县' },
        { code: '330281', name: '余姚市' },
        { code: '330282', name: '慈溪市' },
      ]},
      { code: '330300', name: '温州市', children: [
        { code: '330302', name: '鹿城区' },
        { code: '330303', name: '龙湾区' },
        { code: '330304', name: '瓯海区' },
        { code: '330305', name: '洞头区' },
        { code: '330324', name: '永嘉县' },
        { code: '330326', name: '平阳县' },
        { code: '330327', name: '苍南县' },
        { code: '330328', name: '文成县' },
        { code: '330329', name: '泰顺县' },
        { code: '330381', name: '瑞安市' },
        { code: '330382', name: '乐清市' },
        { code: '330383', name: '龙港市' },
      ]},
    ]
  },
  {
    code: '420000',
    name: '湖北省',
    children: [
      { code: '420100', name: '武汉市', children: [
        { code: '420102', name: '江岸区' },
        { code: '420103', name: '江汉区' },
        { code: '420104', name: '硚口区' },
        { code: '420105', name: '汉阳区' },
        { code: '420106', name: '武昌区' },
        { code: '420107', name: '青山区' },
        { code: '420111', name: '洪山区' },
        { code: '420112', name: '东西湖区' },
        { code: '420113', name: '汉南区' },
        { code: '420114', name: '蔡甸区' },
        { code: '420115', name: '江夏区' },
        { code: '420116', name: '黄陂区' },
        { code: '420117', name: '新洲区' },
      ]},
    ]
  },
  {
    code: '510000',
    name: '四川省',
    children: [
      { code: '510100', name: '成都市', children: [
        { code: '510104', name: '锦江区' },
        { code: '510105', name: '青羊区' },
        { code: '510106', name: '金牛区' },
        { code: '510107', name: '武侯区' },
        { code: '510108', name: '成华区' },
        { code: '510112', name: '龙泉驿区' },
        { code: '510113', name: '青白江区' },
        { code: '510114', name: '新都区' },
        { code: '510115', name: '温江区' },
        { code: '510116', name: '双流区' },
        { code: '510117', name: '郫都区' },
        { code: '510118', name: '新津区' },
        { code: '510121', name: '金堂县' },
        { code: '510129', name: '大邑县' },
        { code: '510131', name: '蒲江县' },
        { code: '510181', name: '都江堰市' },
        { code: '510182', name: '彭州市' },
        { code: '510183', name: '邛崃市' },
        { code: '510184', name: '崇州市' },
        { code: '510185', name: '简阳市' },
      ]},
    ]
  },
]

interface AddressSelectorStaticProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const AddressSelectorStatic: React.FC<AddressSelectorStaticProps> = ({ 
  value, 
  onChange, 
  placeholder = '请选择地址' 
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')

  // 解析已选择的值
  useState(() => {
    if (value) {
      const parts = value.split('-')
      if (parts.length >= 3) {
        setSelectedProvince(parts[0])
        setSelectedCity(parts[1])
        setSelectedDistrict(parts[2])
      }
    }
  })

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value
    setSelectedProvince(provinceCode)
    setSelectedCity('')
    setSelectedDistrict('')
    onChange('')
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = e.target.value
    setSelectedCity(cityCode)
    setSelectedDistrict('')
    onChange('')
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value
    setSelectedDistrict(districtCode)
    
    // 获取完整的省市区文本地址
    const provinceName = addressData.find(p => p.code === selectedProvince)?.name || ''
    const cityName = selectedProvinceData?.children?.find(c => c.code === selectedCity)?.name || ''
    const districtName = selectedCityData?.children?.find(d => d.code === districtCode)?.name || ''
    
    // 组合完整的地址文本（而不是代码）
    const fullAddressText = `${provinceName} ${cityName} ${districtName}`
    onChange(fullAddressText)
  }

  // 获取选中的省份数据
  const selectedProvinceData = addressData.find(p => p.code === selectedProvince)
  
  // 获取选中的城市数据
  const selectedCityData = selectedProvinceData?.children?.find(c => c.code === selectedCity)

  return (
    <div className="address-selector-static">
      <div className="form-group">
        <label>省份:</label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="form-select"
        >
          <option value="">请选择省份</option>
          {addressData.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
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
            {selectedProvinceData?.children?.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
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
            {selectedCityData?.children?.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 显示已选择的完整地址 */}
      {selectedProvince && selectedCity && selectedDistrict && (
        <div className="selected-address" style={{ 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          已选择: {
            addressData.find(p => p.code === selectedProvince)?.name
          } - {
            selectedProvinceData?.children?.find(c => c.code === selectedCity)?.name
          } - {
            selectedCityData?.children?.find(d => d.code === selectedDistrict)?.name
          }
        </div>
      )}
    </div>
  )
}

export default AddressSelectorStatic