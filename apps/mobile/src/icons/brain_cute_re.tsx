// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const BrainCuteReIcon = ({
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
      d="M12 7v10m0-10a3 3 0 1 0-6 0v2a3 3 0 1 0 0 6m6-8a3 3 0 1 1 6 0v2a3 3 0 1 1 0 6m-6 2a3 3 0 1 1-6 0v-2m6 2a3 3 0 1 0 6 0v-2M6 15c.35 0 .687-.06 1-.17M9 12a3 3 0 0 1 3 3a3 3 0 0 1 3-3m3 3c-.35 0-.687-.06-1-.17"
    />
  </Svg>
)
