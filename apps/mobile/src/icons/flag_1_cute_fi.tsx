// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Flag1CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M4 5a2 2 0 0 1 2-2h14a1 1 0 0 1 .809 1.588L17.236 9.5l3.573 4.912A1 1 0 0 1 20 16H6v5a1 1 0 1 1-2 0z"
      clipRule="evenodd"
    />
  </Svg>
)
