// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const User4CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 13c-2.424 0-4.634.822-6.255 1.984A7.98 7.98 0 0 0 12 20a7.98 7.98 0 0 0 6.254-3.016C16.634 15.822 14.424 15 12 15m0-9a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7"
    />
  </Svg>
)
