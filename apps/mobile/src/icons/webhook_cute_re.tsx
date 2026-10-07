// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const WebhookCuteReIcon = ({
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
      d="M13.912 9.312a3 3 0 1 0-3.824-4.624a3 3 0 0 0 3.824 4.624Zm-3.824 0l-2.858 4.95m6.682-4.95l2.858 4.95M8.83 18a3 3 0 1 0-5.66-2a3 3 0 0 0 5.66 2Zm0 0h6.34m1.6-3.737a3 3 0 1 0 2.46 5.473a3 3 0 0 0-2.46-5.473Z"
    />
  </Svg>
)
