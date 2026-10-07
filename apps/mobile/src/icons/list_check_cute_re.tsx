// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const ListCheckCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M5 5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m0 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m0 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2}
      d="M9 5h11M9 12h11M9 19h11M5 5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Z"
    />
  </Svg>
)
