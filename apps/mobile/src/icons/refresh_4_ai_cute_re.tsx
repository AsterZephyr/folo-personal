// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Refresh4AiCuteReIcon = ({
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
      d="M9.5 3.5L7 6l2.5 2.5m7 9.5H11a7 7 0 0 1-7-7v-1m10.5 10.5L17 18l-2.5-2.5M7.5 6H13c1.074 0 2.09.242 3 .674M19 8l.13.378a4 4 0 0 0 2.492 2.493L22 11l-.378.13a4 4 0 0 0-2.493 2.492L19 14l-.13-.378a4 4 0 0 0-2.492-2.493L16 11l.378-.13a4 4 0 0 0 2.493-2.492z"
    />
  </Svg>
)
