// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PolygonCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="m11.889 11l-3.67-6.607a.25.25 0 0 0-.438 0L3.206 12.63a.25.25 0 0 0 .219.371H8m7 0h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5m4 4.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0Z"
    />
  </Svg>
)
