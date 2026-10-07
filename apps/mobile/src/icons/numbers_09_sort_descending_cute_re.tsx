// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Numbers09SortDescendingCuteReIcon = ({
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
      d="M10 15.01c0 3-2.5 4.99-2.5 4.99m9.5 0V5.328m-2.828 2.5L17 5l2.828 2.828M8 17a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0-7a2 2 0 0 1-2-2V6a2 2 0 1 1 4 0v2a2 2 0 0 1-2 2"
    />
  </Svg>
)
