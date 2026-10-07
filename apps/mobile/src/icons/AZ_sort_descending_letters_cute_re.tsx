// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AZSortDescendingLettersCuteReIcon = ({
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
      d="M17 20V5.328m-2.828 2.5L17 5l2.828 2.828M6 9h4m-5 2l2.332-6.53a.71.71 0 0 1 1.336 0L11 11m-6 3h5.759a.1.1 0 0 1 .07.17l-5.658 5.66a.1.1 0 0 0 .07.17H11"
    />
  </Svg>
)
