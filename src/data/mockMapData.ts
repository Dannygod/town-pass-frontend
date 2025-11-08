import type { PointArea, PolygonRegion } from '@/types/mapData'

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
