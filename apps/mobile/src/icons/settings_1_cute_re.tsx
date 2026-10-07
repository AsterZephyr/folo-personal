// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Settings1CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path fill="none" stroke={color} strokeWidth={2} d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z" />
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M10.5 3.628a3 3 0 0 1 3 0l5 2.887A3 3 0 0 1 20 9.113v5.773a3 3 0 0 1-1.5 2.598l-5 2.887a3 3 0 0 1-3 0l-5-2.887A3 3 0 0 1 4 14.886V9.113a3 3 0 0 1 1.5-2.598z"
    />
  </Svg>
)
