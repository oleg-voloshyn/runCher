import { useEffect, useRef } from 'react'
import L from 'leaflet'
import polylineCodec from '@mapbox/polyline'
import 'leaflet/dist/leaflet.css'

const COLOR = '#fc4c02'

function dotMarker(latlng, name, extra) {
  return L.circleMarker(latlng, {
    radius: 6,
    fillColor: COLOR,
    color: '#fff',
    weight: 2,
    fillOpacity: 1,
  }).bindPopup(`<b>${name}</b>${extra ? `<br>${extra}` : ''}`)
}

export default function SegmentMap({ segments }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  const hasCoords = segments.some(
    (s) => s.polyline || (s.start_latitude && s.start_longitude)
  )

  useEffect(() => {
    if (!containerRef.current || !hasCoords) return
    if (mapRef.current) return // already initialised

    const map = L.map(containerRef.current, { zoomControl: true })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const bounds = L.latLngBounds()

    segments.forEach((seg) => {
      if (seg.polyline) {
        const latlngs = polylineCodec.decode(seg.polyline)
        if (latlngs.length > 0) {
          L.polyline(latlngs, { color: COLOR, weight: 4, opacity: 0.85 })
            .bindTooltip(seg.name, { sticky: true })
            .addTo(map)

          dotMarker(
            latlngs[0],
            seg.name,
            seg.distance ? `${(seg.distance / 1000).toFixed(2)} km` : null
          ).addTo(map)

          latlngs.forEach((ll) => bounds.extend(ll))
        }
      } else if (seg.start_latitude && seg.start_longitude) {
        const start = [seg.start_latitude, seg.start_longitude]
        const end =
          seg.end_latitude && seg.end_longitude
            ? [seg.end_latitude, seg.end_longitude]
            : start

        L.polyline([start, end], { color: COLOR, weight: 4, opacity: 0.7, dashArray: '6 4' })
          .bindTooltip(seg.name, { sticky: true })
          .addTo(map)

        dotMarker(start, seg.name).addTo(map)

        bounds.extend(start)
        bounds.extend(end)
      }
    })

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [32, 32] })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [segments, hasCoords])

  if (!hasCoords) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
      <div ref={containerRef} style={{ height: 380 }} />
    </div>
  )
}
