// 點區域 - Point Area (涼適點 Cold Spot)
export interface PointArea {
  id: string
  name: string
  type: 'cold' | 'fire_safety' | 'AED_location' // 可擴展更多類型
  lat: number
  lon: number
  description?: string
  // 詳細信息（用於 UI 顯示）
  location_type?: '戶外' | '室內'
  address?: string
  district_name?: string
  open_hours?: string
  notes?: string
  facilities?: string[]
}

// 篩選類型
export type FilterType = 'cold' | 'fire_safety' | 'AED_location'

// 篩選按鈕配置
export interface FilterButton {
  id: FilterType
  label: string
  icon?: string
  color: string
}

// 範圍區域 - Polygon Region
export interface PolygonRegion {
  id: string
  name: string
  type: 'comfort_zone' | 'park' | 'activity_area' // 可擴展更多類型
  coordinates: Array<{ lat: number; lon: number }> // GeoJSON polygon format
  color: string // 區域顏色
  fillOpacity?: number // 填充透明度
  description?: string
}

// 圖層類型
export type LayerType = 'points' | 'regions' | 'both' | 'none'
