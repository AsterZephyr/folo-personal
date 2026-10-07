// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const LinkCuteReIcon = ({
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
      d="m11.646 5.989l-1.414-1.414a4 4 0 1 0-5.657 5.656l2.829 2.829a4 4 0 0 0 5.657 0m-.707 4.95l1.414 1.414a4 4 0 1 0 5.657-5.657l-2.829-2.828a4 4 0 0 0-5.657 0"
    />
  </Svg>
)
