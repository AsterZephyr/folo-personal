// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const DepartmentCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 0v4m-6 4a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm0 0v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m0 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"
    />
  </Svg>
)
