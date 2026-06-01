import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 修复 Leaflet 默认图标问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createEmojiIcon(emoji) {
  return L.divIcon({
    className: 'emoji-marker',
    html: `<div style="font-size:28px;text-align:center;line-height:1">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function WorkoutMap({ recordsWithLocation, exerciseTypes }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    mapInstance.current = L.map(mapRef.current).setView([39.9, 116.4], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapInstance.current)
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current

    // 清除旧标记
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer)
      }
    })

    if (recordsWithLocation.length === 0) return

    const points = []
    const typeMap = Object.fromEntries(exerciseTypes.map(t => [t.id, t]))

    recordsWithLocation.forEach(record => {
      const { lat, lng } = record.location
      const typeInfo = typeMap[record.type] || { icon: '🎯', name: '其他' }
      const point = [lat, lng]
      points.push(point)

      const marker = L.marker(point, { icon: createEmojiIcon(typeInfo.icon) })
      marker.bindPopup(`
        <div style="text-align:center;min-width:100px">
          <div style="font-size:20px">${typeInfo.icon}</div>
          <div style="font-weight:600;margin:4px 0">${typeInfo.name}</div>
          <div style="font-size:13px;color:#666">${record.duration} 分钟</div>
          <div style="font-size:12px;color:#999">${record.date}</div>
          ${record.note ? `<div style="font-size:12px;color:#666;margin-top:4px">${record.note}</div>` : ''}
        </div>
      `)
      marker.addTo(map)
    })

    // 如果有多个点，画轨迹线
    if (points.length > 1) {
      L.polyline(points, {
        color: '#4f8cff',
        weight: 3,
        opacity: 0.7,
        dashArray: '6, 8',
      }).addTo(map)
    }

    // 自动缩放到所有标记
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
  }, [recordsWithLocation, exerciseTypes])

  return (
    <div className="map-section">
      <h2>🗺 运动地图</h2>
      {recordsWithLocation.length === 0 ? (
        <div className="map-empty">
          <p>📍 还没有带定位的打卡记录</p>
          <p className="map-empty-hint">打卡时允许定位权限，就能在地图上看到你的运动轨迹！</p>
        </div>
      ) : (
        <div className="map-stats">
          <span>共 {recordsWithLocation.length} 个标记点</span>
        </div>
      )}
      <div ref={mapRef} className="map-container" />
    </div>
  )
}
