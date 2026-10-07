// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const FingerPressCuteReIcon = ({
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
      d="M19.326 21c.432-.91.674-1.926.674-3v-.315a3 3 0 0 0-2.669-2.981l-4.462-.59a1 1 0 0 1-.869-.99V8.5a1.5 1.5 0 0 0-3 0V17c-2-2.5-3-3-5-2l3 6m8.793-11A5.5 5.5 0 1 0 5.6 11"
    />
  </Svg>
)
