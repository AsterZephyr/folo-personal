// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Eye2CuteReIcon = ({
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
      d="M21 12c0 1.5-4.03 6-9 6s-9-4.5-9-6s4.03-6 9-6s9 4.5 9 6Z"
    />
    <Path fill="none" stroke={color} strokeWidth={2} d="M14 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z" />
  </Svg>
)
