// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const ToolCuteReIcon = ({
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
      d="M13.646 5.14a6 6 0 0 1 1.267 6.62l4.928 4.17a2.76 2.76 0 1 1-3.89 3.89l-4.17-4.927a6.002 6.002 0 0 1-7.8-8.083l3.832 4.162l2.652-.527l.53-2.655L6.83 3.96a6 6 0 0 1 6.816 1.18Z"
    />
  </Svg>
)
