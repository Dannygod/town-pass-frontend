import type { PointArea } from '@/types/mapData'

// 使用代理路徑來避免 CORS 問題
// 開發環境使用代理，生產環境使用環境變數中的後端 URL
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : (import.meta.env.VITE_BACKEND_URL || '')

// GeoJSON Feature 結構
interface GeoJSONFeature {
  type: 'Feature'
  id: number
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lon, lat]
  }
  properties: {
    id: number
    location_type: string
    name: string
    district_name: string
    address: string
    lon: number
    lat: number
    phone: string | null
    ext: string | null
    mobile: string | null
    other_contact: string | null
    open_hours: string
    fan: boolean
    ac: boolean
    toilet: boolean
    seating: boolean
    drinking: boolean
    accessible_seat: boolean
    features: string | null
    notes: string | null
  }
}

// GeoJSON FeatureCollection 結構
interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

/**
 * 獲取所有涼適點
 */
export async function fetchColdSpots(): Promise<PointArea[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sites`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data: GeoJSONFeatureCollection = await response.json()
    
    // 將 GeoJSON FeatureCollection 轉換為 PointArea 格式
    return data.features.map((feature) => {
      const props = feature.properties
      
      // 組合描述信息
      const descriptionParts: string[] = []
      if (props.address) descriptionParts.push(`地址：${props.address}`)
      if (props.district_name) descriptionParts.push(`區域：${props.district_name}`)
      if (props.open_hours) descriptionParts.push(`開放時間：${props.open_hours}`)
      if (props.notes) descriptionParts.push(`備註：${props.notes}`)
      
      // 組合設施信息
      const facilities: string[] = []
      if (props.fan) facilities.push('風扇')
      if (props.ac) facilities.push('冷氣')
      if (props.toilet) facilities.push('廁所')
      if (props.seating) facilities.push('座位')
      if (props.drinking) facilities.push('飲水')
      if (props.accessible_seat) facilities.push('無障礙座位')
      
      return {
        id: `cold-${props.id}`,
        name: props.name,
        type: 'cold' as const,
        lat: props.lat || feature.geometry.coordinates[1], // 優先使用 properties 中的 lat
        lon: props.lon || feature.geometry.coordinates[0], // 優先使用 properties 中的 lon
        description: descriptionParts.join(' | ') || undefined, // 保留舊格式以向後兼容
        // 詳細信息
        location_type: (props.location_type === '戶外' || props.location_type === '室內') 
          ? props.location_type 
          : undefined,
        address: props.address || undefined,
        district_name: props.district_name || undefined,
        open_hours: props.open_hours || undefined,
        notes: props.notes || undefined,
        facilities: facilities.length > 0 ? facilities : undefined
      }
    })
  } catch (error) {
    console.error('Failed to fetch cold spots:', error)
    // 如果API失敗，返回空數組或拋出錯誤
    throw error
  }
}

