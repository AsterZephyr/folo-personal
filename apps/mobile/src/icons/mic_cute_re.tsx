// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const MicCuteReIcon = ({
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
      d="M12 19v2m0-2a7 7 0 0 1-6.93-6M12 19a7 7 0 0 0 6.929-6M12 16a4 4 0 0 1-4-4V7a4 4 0 1 1 8 0v5a4 4 0 0 1-4 4Z"
    />
  </Svg>
)
