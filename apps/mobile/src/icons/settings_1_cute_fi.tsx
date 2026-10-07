// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Settings1CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M10 2.762a4 4 0 0 1 4 0l5 2.887a4 4 0 0 1 2 3.464v5.774a4 4 0 0 1-2 3.463l-5 2.887a4 4 0 0 1-4 0L5 18.35a4 4 0 0 1-2-3.464V9.114A4 4 0 0 1 5 5.65zM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
    />
  </Svg>
)
