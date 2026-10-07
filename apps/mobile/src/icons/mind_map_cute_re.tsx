// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const MindMapCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M15 12.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0Zm0 0h3m0 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 0 0-3 0ZM6.652 8.46l2.16 1.8m4.555-3.362l-.76 2.28m2.832 8.261l-2.015-2.015M7.376 17.55l1.933-2.32M16 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm2 13.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0ZM7 7.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0ZM8 19a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"
    />
  </Svg>
)
