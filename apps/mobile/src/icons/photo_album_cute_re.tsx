// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PhotoAlbumCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path fill={color} d="M17 11a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2}
      d="m15.857 16.655l1.59-1.591a.25.25 0 0 1 .355 0L21 18.262m-15 0l5.555-5.555a.25.25 0 0 1 .354 0l4.71 4.71M18 4H5a2 2 0 0 0-2 2v11m14-6a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0ZM7 20.333h13a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11.333a1 1 0 0 0 1 1Z"
    />
  </Svg>
)
