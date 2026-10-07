// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const User3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M20 18.5c0 1.933-3.582 2.5-8 2.5s-8-.567-8-2.5S7.582 14 12 14s8 2.567 8 4.5ZM16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"
    />
  </Svg>
)
