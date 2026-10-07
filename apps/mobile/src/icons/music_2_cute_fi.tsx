// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Music2CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M18.633 9.175L14 10.72v6.779a4.5 4.5 0 1 1-2-3.742V6.44a3 3 0 0 1 2.051-2.846l3.975-1.324A1.5 1.5 0 0 1 20 3.693v3.585a2 2 0 0 1-1.367 1.897"
    />
  </Svg>
)
