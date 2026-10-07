// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const More1CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12.5 12a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m6 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m-12 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"
    />
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M12.5 12a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm6 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm-12 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Z"
    />
  </Svg>
)
