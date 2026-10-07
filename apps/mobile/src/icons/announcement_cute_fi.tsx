// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AnnouncementCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M16.744 2.576A1.5 1.5 0 0 1 19 3.87V8a3 3 0 1 1 0 6v4c0 1.236-1.411 1.941-2.4 1.2l-2.293-1.72A11 11 0 0 0 10 15.523v2.768a2.71 2.71 0 0 1-5.316.744l-1.57-5.496a4.7 4.7 0 0 1 3.326-7.73l2.62-.146a11 11 0 0 0 4.932-1.482zM5.634 15.079l.973 3.407A.71.71 0 0 0 8 18.29v-3.01l-1.56-.088a5 5 0 0 1-.806-.114M19 12a1 1 0 1 0 0-2z"
      clipRule="evenodd"
    />
  </Svg>
)
