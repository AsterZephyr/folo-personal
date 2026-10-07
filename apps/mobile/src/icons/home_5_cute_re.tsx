// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Home5CuteReIcon = ({
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
      d="M3.005 9.998v-.002l8.381-6.518a1 1 0 0 1 1.228 0l8.381 6.518v.002L19 10l-.91 9.1a1 1 0 0 1-.995.9H6.905a1 1 0 0 1-.995-.9L5 10z"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.5 13a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"
    />
  </Svg>
)
