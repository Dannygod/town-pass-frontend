import type { PointArea, PolygonRegion, FilterButton } from '@/types/mapData'

// Mock data for 涼適點 (Cold and Comfortable Places)
export const mockColdSpots: PointArea[] = [
  {
    id: 'cold-1',
    name: '台北101涼適點',
    type: 'cold',
    lat: 25.0339,
    lon: 121.5645,
    description: '台北101附近的涼爽休息處'
  },
  {
    id: 'cold-2',
    name: '信義廣場涼適點',
    type: 'cold',
    lat: 25.0375,
    lon: 121.5625,
    description: '信義廣場遮陽休息區'
  },
  {
    id: 'cold-3',
    name: '市政府站涼適點',
    type: 'cold',
    lat: 25.0408,
    lon: 121.5678,
    description: '捷運市政府站周邊涼爽區域'
  },
  {
    id: 'cold-4',
    name: '世貿公園涼適點',
    type: 'cold',
    lat: 25.0310,
    lon: 121.5610,
    description: '世貿公園樹蔭下休息區'
  },
  {
    id: 'cold-5',
    name: '國父紀念館涼適點',
    type: 'cold',
    lat: 25.0403,
    lon: 121.5601,
    description: '國父紀念館涼爽步道'
  }
]

// Mock data for 消防不合格場所 (Fire Safety Violations)
export const mockFireSafetyViolations: PointArea[] = [
  {
    id: 'fire-1',
    name: '信義區某餐廳',
    type: 'fire_safety',
    lat: 25.0350,
    lon: 121.5650,
    description: '消防設備檢查不合格'
  },
  {
    id: 'fire-2',
    name: '101大樓附近商店',
    type: 'fire_safety',
    lat: 25.0340,
    lon: 121.5640,
    description: '逃生通道阻塞'
  },
  {
    id: 'fire-3',
    name: '市政府周邊大樓',
    type: 'fire_safety',
    lat: 25.0390,
    lon: 121.5670,
    description: '滅火器過期未更換'
  }
]

// Mock data for 空氣污染 (Air Pollution)
export const mockAirPollution: PointArea[] = [
  {
    id: 'air-1',
    name: '信義路五段',
    type: 'AED_location',
    lat: 25.0320,
    lon: 121.5630,
    description: 'PM2.5 濃度超標'
  },
  {
    id: 'air-2',
    name: '松仁路交叉口',
    type: 'AED_location',
    lat: 25.0360,
    lon: 121.5660,
    description: '空氣品質不良'
  },
  {
    id: 'air-3',
    name: '市府轉運站',
    type: 'AED_location',
    lat: 25.0380,
    lon: 121.5620,
    description: 'NO2 濃度偏高'
  },
  {
    id: 'air-4',
    name: '世貿中心',
    type: 'AED_location',
    lat: 25.0300,
    lon: 121.5600,
    description: '臭氧濃度超標'
  }
]

// Mock data for 公安風險 (Public Safety Risks)
export const mockFireSafety: PointArea[] = [
  {
    id: 'safety-1',
    name: '信義商圈人行道',
    type: 'fire_safety',
    lat: 25.0355,
    lon: 121.5645,
    description: '路面不平整，有跌倒風險'
  },
  {
    id: 'safety-2',
    name: '101大樓周邊',
    type: 'fire_safety',
    lat: 25.0335,
    lon: 121.5635,
    description: '施工區域警示不足'
  },
  {
    id: 'safety-3',
    name: '市政府廣場',
    type: 'fire_safety',
    lat: 25.0375,
    lon: 121.5655,
    description: '照明設備故障'
  },
  {
    id: 'safety-4',
    name: '世貿公園',
    type: 'fire_safety',
    lat: 25.0315,
    lon: 121.5615,
    description: '設施維護不良'
  },
  {
    id: 'safety-5',
    name: '國父紀念館周邊',
    type: 'fire_safety',
    lat: 25.0400,
    lon: 121.5605,
    description: '交通標誌不清'
  }
]

// 注意：allLocations 現在應該在組件中動態組合，使用API獲取的涼適點數據
// 此函數用於組合所有地點數據
export function combineAllLocations(coldSpots: PointArea[]): PointArea[] {
  return [
    ...coldSpots,
    ...mockFireSafety,
    ...mockAirPollution,
  ]
}

// 篩選按鈕配置
export const filterButtons: FilterButton[] = [
  {
    id: 'cold',
    label: '涼適點',
    color: '#5AB4C5' // primary500
  },
  {
    id: 'fire_safety',
    label: '消防不合格場所',
    color: '#D45251' // red500
  },
  {
    id: 'AED_location',
    label: 'AED',
    color: '#22C55E' // green500
  }
]

// Mock data for 範圍區域 (Polygon Regions)
export const mockPolygonRegions: PolygonRegion[] = [
  {
    id: 'region-1',
    name: '信義商圈舒適區',
    type: 'comfort_zone',
    coordinates: [
      { lat: 25.0350, lon: 121.5600 },
      { lat: 25.0350, lon: 121.5680 },
      { lat: 25.0400, lon: 121.5680 },
      { lat: 25.0400, lon: 121.5600 }
    ],
    color: '#5AB4C5', // TownPass primary color
    fillOpacity: 0.3,
    description: '信義區主要舒適活動區域'
  },
  {
    id: 'region-2',
    name: '101周邊綠地',
    type: 'park',
    coordinates: [
      { lat: 25.0310, lon: 121.5630 },
      { lat: 25.0310, lon: 121.5660 },
      { lat: 25.0340, lon: 121.5660 },
      { lat: 25.0340, lon: 121.5630 }
    ],
    color: '#71C5D5', // TownPass primary400
    fillOpacity: 0.4,
    description: '台北101周邊公園綠地'
  },
  {
    id: 'region-3',
    name: '市府廣場活動區',
    type: 'activity_area',
    coordinates: [
      { lat: 25.0370, lon: 121.5610 },
      { lat: 25.0370, lon: 121.5650 },
      { lat: 25.0410, lon: 121.5650 },
      { lat: 25.0410, lon: 121.5610 }
    ],
    color: '#F5BA4B', // TownPass secondary color
    fillOpacity: 0.35,
    description: '市政府廣場公共活動區域'
  }
]
