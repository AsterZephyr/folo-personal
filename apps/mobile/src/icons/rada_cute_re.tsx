// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const RadaCuteReIcon = ({
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
      d="M8.464 8.464A4.98 4.98 0 0 0 7 12c0 1.411.585 2.686 1.525 3.595m7.01-.06A4.98 4.98 0 0 0 17 12c0-1.364-.546-2.6-1.432-3.503M5.636 5.636A8.97 8.97 0 0 0 3 12a8.97 8.97 0 0 0 2.636 6.364M18.364 5.636A8.97 8.97 0 0 1 21 12a8.97 8.97 0 0 1-2.636 6.364M13 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"
    />
  </Svg>
)
