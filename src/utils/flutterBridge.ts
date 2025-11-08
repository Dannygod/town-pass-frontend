/**
 * Flutter WebView 橋接工具
 * 用於與 Flutter App 的 WebView 進行雙向通訊
 */

export interface FlutterPosition {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number
  heading: number
  speed: number
  speedAccuracy: number
  timestamp: number
}

export interface FlutterMessage {
  name: string
  data: any
}

/**
 * 檢查是否在 Flutter WebView 環境中
 */
export function isInFlutterWebView(): boolean {
  return typeof (window as any).flutterObject !== 'undefined'
}

/**
 * 向 Flutter 發送訊息
 * 使用 WebMessageListener 的 onmessage 事件處理器接收回覆
 */
export async function postMessageToFlutter(name: string, data: any = null): Promise<any> {
  if (!isInFlutterWebView()) {
    throw new Error('不在 Flutter WebView 環境中')
  }

  return new Promise((resolve, reject) => {
    const flutterObject = (window as any).flutterObject

    console.log(`[FlutterBridge] 發送訊息: ${name}`, data)

    // 設定超時（10秒）
    const timeout = setTimeout(() => {
      // 移除訊息處理器
      flutterObject.onmessage = null
      console.error('[FlutterBridge] 回覆超時')
      reject(new Error('Flutter 回覆超時'))
    }, 10000)

    // 設定 onmessage 處理器接收回覆
    flutterObject.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout)

      try {
        console.log('[FlutterBridge] 收到回覆:', event.data)

        // 解析回覆
        let response: FlutterMessage
        if (typeof event.data === 'string') {
          response = JSON.parse(event.data)
        } else {
          response = event.data
        }

        // 檢查是否為對應的回覆
        if (response.name === name) {
          console.log('[FlutterBridge] 回覆資料:', response.data)
          resolve(response.data)
        } else {
          console.warn(`[FlutterBridge] 回覆訊息名稱不符: 期望 ${name}, 收到 ${response.name}`)
          reject(new Error(`回覆訊息名稱不符: 期望 ${name}, 收到 ${response.name}`))
        }
      } catch (error) {
        console.error('[FlutterBridge] 解析回覆失敗:', error)
        reject(error)
      } finally {
        // 清除 onmessage 處理器
        flutterObject.onmessage = null
      }
    }

    // 發送訊息
    try {
      const message = JSON.stringify({ name, data })
      console.log('[FlutterBridge] 發送訊息內容:', message)
      flutterObject.postMessage(message)
    } catch (error) {
      clearTimeout(timeout)
      flutterObject.onmessage = null
      console.error('[FlutterBridge] 發送訊息失敗:', error)
      reject(error)
    }
  })
}

/**
 * 從 Flutter 取得使用者位置
 */
export async function getLocationFromFlutter(): Promise<FlutterPosition | null> {
  try {
    const position = await postMessageToFlutter('location', null)

    // 如果返回空陣列，表示取得位置失敗
    if (Array.isArray(position) && position.length === 0) {
      throw new Error('無法取得位置資訊')
    }

    return position as FlutterPosition
  } catch (error) {
    console.error('從 Flutter 取得位置失敗:', error)
    throw error
  }
}

/**
 * 取得裝置資訊
 */
export async function getDeviceInfoFromFlutter(): Promise<any> {
  try {
    return await postMessageToFlutter('deviceinfo', null)
  } catch (error) {
    console.error('從 Flutter 取得裝置資訊失敗:', error)
    throw error
  }
}

/**
 * 取得使用者資訊
 */
export async function getUserInfoFromFlutter(): Promise<any> {
  try {
    return await postMessageToFlutter('userinfo', null)
  } catch (error) {
    console.error('從 Flutter 取得使用者資訊失敗:', error)
    throw error
  }
}

/**
 * 開啟地圖應用
 */
export async function launchMapFromFlutter(url: string): Promise<boolean> {
  try {
    return await postMessageToFlutter('launch_map', url)
  } catch (error) {
    console.error('開啟地圖應用失敗:', error)
    return false
  }
}

/**
 * 撥打電話
 */
export async function makePhoneCallFromFlutter(phoneNumber: string): Promise<boolean> {
  try {
    return await postMessageToFlutter('phone_call', phoneNumber)
  } catch (error) {
    console.error('撥打電話失敗:', error)
    return false
  }
}

/**
 * 掃描 QR Code
 */
export async function scanQRCodeFromFlutter(): Promise<string | null> {
  try {
    return await postMessageToFlutter('qr_code_scan', null)
  } catch (error) {
    console.error('掃描 QR Code 失敗:', error)
    return null
  }
}

/**
 * 顯示通知
 */
export async function showNotificationFromFlutter(title: string, content: string): Promise<void> {
  try {
    await postMessageToFlutter('notify', { title, content })
  } catch (error) {
    console.error('顯示通知失敗:', error)
  }
}
