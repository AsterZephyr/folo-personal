// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const MicCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M19.07 12.01a1 1 0 0 1 .85 1.132A8 8 0 0 1 13 19.936V21a1 1 0 0 1-2 0v-1.064a8 8 0 0 1-6.919-6.794a1 1 0 0 1 1.98-.284a6.002 6.002 0 0 0 11.879 0a1 1 0 0 1 1.13-.848M12 2a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5"
    />
  </Svg>
)
