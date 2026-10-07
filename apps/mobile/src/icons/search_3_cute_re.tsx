// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Search3CuteReIcon = ({
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
      d="M10.5 7a3.5 3.5 0 0 1 3.5 3.5m1.879 5.379l4.242 4.242M18 10.5a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0Z"
    />
  </Svg>
)
