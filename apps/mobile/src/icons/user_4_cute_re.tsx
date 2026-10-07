// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const User4CuteReIcon = ({
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
      d="M5.628 18.356C7.09 17.04 9.4 16 12 16s4.91 1.04 6.372 2.356M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Zm-6-2a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"
    />
  </Svg>
)
