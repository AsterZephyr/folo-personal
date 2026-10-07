// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const DanmakuCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M18 3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-6.667L8 20.5c-.824.618-2 .03-2-1V18H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM3 12a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm10 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zM5 7a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
    />
  </Svg>
)
