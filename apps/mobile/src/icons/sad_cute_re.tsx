// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const SadCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path fill={color} d="M9 9.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m7 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2}
      d="M9.354 15c.705-.622 1.632-1 2.646-1s1.94.378 2.646 1M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0ZM9 9.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm7 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Z"
    />
  </Svg>
)
