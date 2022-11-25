import type { Feature, FeatureCollection, Point } from 'geojson'
import { type LayerProps, Layer, Source } from 'react-map-gl'

const layer: LayerProps = {
  type: 'circle',
  paint: {
    'circle-color': '#666',
    'circle-radius': 5,
  },
}

export interface GeoMapMarkerLayerProps<T extends EmptyObject = EmptyObject> {
  data: FeatureCollection<Point, T>
  onChangeHover?: (feature: Feature<Point, T> | null) => void
}

/**
 * GeoJSON marker layer for geo-visualisation.
 */
export function GeoMapMarkerLayer<T extends EmptyObject = EmptyObject>(
  props: GeoMapMarkerLayerProps<T>,
): JSX.Element {
  const { data } = props

  return (
    <Source data={data} type="geojson">
      <Layer {...layer} />
    </Source>
  )
}