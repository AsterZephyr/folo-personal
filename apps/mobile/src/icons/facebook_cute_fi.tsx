// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const FacebookCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2c5.523 0 10 4.477 10 10c0 5.013-3.689 9.163-8.5 9.887V15h1a1.5 1.5 0 0 0 0-3h-1v-2a.5.5 0 0 1 .5-.5h.5a1.5 1.5 0 0 0 0-3H14a3.5 3.5 0 0 0-3.5 3.5v2h-1a1.5 1.5 0 0 0 0 3h1v6.887C5.689 21.163 2 17.013 2 12C2 6.477 6.477 2 12 2"
    />
  </Svg>
)
