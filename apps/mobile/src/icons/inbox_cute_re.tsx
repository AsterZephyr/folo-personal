// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const InboxCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M3.5 12h5a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 .5-.5h5m.236-.461l-3.448-6.035A1 1 0 0 0 16.42 5H7.58a1 1 0 0 0-.868.504l-3.448 6.035A2 2 0 0 0 3 12.53V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5.469a2 2 0 0 0-.264-.992Z"
    />
  </Svg>
)
