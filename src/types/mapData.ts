// 點區域 - Point Area (涼適點 Cold Spot)
export interface PointArea {
  id: string
  name: string
  type: 'cold' | 'fire_safety' | 'air_pollution' | 'public_safety' // 可擴展更多類型
  lat: number
  lon: number
  description?: string
}

// 篩選類型
export type FilterType = 'cold' | 'fire_safety' | 'air_pollution' | 'public_safety'

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
