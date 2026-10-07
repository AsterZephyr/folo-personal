// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const BugCuteReIcon = ({
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
      strokeWidth={2}
      d="M6 13H3m18 0h-3M7 9C6 9 4.5 8 4 7m3 11c-1.5 0-2 2-2 3m12-3c1.5 0 2 2 2 3M17 9c1 0 2.5-1 3-2m-8 13.88v-8m-6 .62c0-1.688.446-3.246 1.2-4.5h9.6c.754 1.254 1.2 2.812 1.2 4.5c0 4.142-2.686 7.5-6 7.5s-6-3.358-6-7.5ZM8.535 6h6.93A4 4 0 0 0 12 4c-1.48 0-2.773.804-3.465 2Z"
    />
  </Svg>
)
