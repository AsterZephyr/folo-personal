// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AtCuteReIcon = ({
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
      d="M16 20.065A9 9 0 1 1 12 3c6-.001 9.5 4.999 9 9.499c-.276 2.485-1.5 3.25-2 3.5c-2 1-3.27-.38-3-2l.5-5m-4.462 7C9.828 16 8 14.21 8 12s1.821-4 4.03-4c2.542 0 4.477 2.339 3.952 4.826c-.39 1.85-2.053 3.174-3.944 3.174Z"
    />
  </Svg>
)
