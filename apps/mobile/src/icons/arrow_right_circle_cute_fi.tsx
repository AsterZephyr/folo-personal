// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const ArrowRightCircleCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m1.419 5.758a1 1 0 1 0-1.414 1.414L13.832 11H7.757a1 1 0 0 0 0 2h6.076l-1.828 1.83a1 1 0 0 0 1.414 1.413l3.535-3.536a1 1 0 0 0 0-1.414z"
    />
  </Svg>
)
