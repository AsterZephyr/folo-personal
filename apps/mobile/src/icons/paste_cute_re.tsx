// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PasteCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 18H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2m0 0v1a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4M7 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1m0 0h2a1 1 0 0 1 1 1v5m2 0h-8a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1"
    />
  </Svg>
)
