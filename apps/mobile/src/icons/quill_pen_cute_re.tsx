// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const QuillPenCuteReIcon = ({
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
      d="M5.93 16.865s6.189.174 9.899-3.536c.988-.988 1.7-2.152 2.214-3.328c.294-.673.523-1.35.7-2l.181-.702M5.93 16.865s.533-5.483 4.243-9.193c3.668-3.668 9.069-4.23 9.19-4.242q.004 0 .005.004c.066.095 1.091 1.63-.187 3.567a2 2 0 0 1-.256.298M5.93 16.865S5.5 20 5.5 21M14 10c1.349-.45 3.965-1.767 4.924-2.702"
    />
  </Svg>
)
