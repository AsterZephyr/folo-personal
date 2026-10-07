// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const BubbleCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M19 18a3 3 0 1 1-6 0a3 3 0 0 1 6 0m-8-3a4 4 0 1 1-8 0a4 4 0 0 1 8 0m10-7a5 5 0 1 1-10 0a5 5 0 0 1 10 0"
    />
  </Svg>
)
