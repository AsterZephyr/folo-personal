// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AZSortAscendingLettersCuteReIcon = ({
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
      d="M17 5v14.828M19.828 17L17 19.828L14.172 17M5.714 9h4.572M5 11l2.381-6.668A.5.5 0 0 1 7.852 4h.296a.5.5 0 0 1 .47.332L11 11m-6 3h6l-6 6h6"
    />
  </Svg>
)
