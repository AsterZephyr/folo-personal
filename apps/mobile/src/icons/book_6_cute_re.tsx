// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Book6CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v14m0 0s2-1.5 4.5-1.5c1.508 0 2.834.546 3.648.979c.364.193.852-.067.852-.479V6.5a.89.89 0 0 0-.417-.774C19.871 5.293 18.318 4.5 16.5 4.5C14 4.5 12 6 12 6s-2-1.5-4.5-1.5c-1.817 0-3.37.793-4.083 1.226A.89.89 0 0 0 3 6.5V19c0 .412.488.672.851.479c.815-.433 2.141-.979 3.649-.979C10 18.5 12 20 12 20Z"
    />
  </Svg>
)
