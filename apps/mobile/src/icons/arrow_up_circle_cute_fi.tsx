// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const ArrowUpCircleCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m.707 5.046a1 1 0 0 0-1.414 0L7.758 10.58a1 1 0 1 0 1.414 1.414L11 10.168v6.075a1 1 0 0 0 2 0v-6.076l1.83 1.828a1 1 0 0 0 1.413-1.414z"
    />
  </Svg>
)
