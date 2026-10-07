// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const GhostCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M9.5 10.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m6 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3a8 8 0 0 0-8 8v8.62a1.4 1.4 0 0 0 2.08 1.224l.942-.523a3 3 0 0 1 2.946.018l.544.31a3 3 0 0 0 2.976 0l.544-.31a3 3 0 0 1 2.946-.018l.942.523A1.4 1.4 0 0 0 20 19.622V11a8 8 0 0 0-8-8Z"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.5 10.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm6 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Z"
    />
  </Svg>
)
