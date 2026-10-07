// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const VolumeMuteCuteReIcon = ({
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
      strokeLinejoin="round"
      strokeWidth={2}
      d="m16.879 9.879l4.242 4.243m-4.242 0l4.242-4.243M14 4v16l-6.74-4.814A1 1 0 0 0 6.68 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.68a1 1 0 0 0 .58-.186z"
    />
  </Svg>
)
