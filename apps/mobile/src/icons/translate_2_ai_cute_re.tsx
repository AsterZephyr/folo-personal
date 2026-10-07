// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Translate2AiCuteReIcon = ({
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
      d="M4 6h9M9 4v2m3 0c0 4-3 8-8 10m2.559-7c.985 2.628 3.237 5.024 6.441 6.561M11 20l4.5-10L20 20m-7.65-3h6.3M19 2l.13.378a4 4 0 0 0 2.492 2.493L22 5l-.378.13a4 4 0 0 0-2.493 2.492L19 8l-.13-.378a4 4 0 0 0-2.492-2.493L16 5l.378-.13a4 4 0 0 0 2.493-2.492z"
    />
  </Svg>
)
