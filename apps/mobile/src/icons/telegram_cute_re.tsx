// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const TelegramCuteReIcon = ({
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
      d="m15.5 11.5l-5 4.5m-.056.167c.777 1.348 4.693 3.598 6.711 4.694a.976.976 0 0 0 1.429-.71l2.269-13.757a.5.5 0 0 0-.688-.543l-17.1 7.2a.486.486 0 0 0-.004.901c1.835.76 5.578 2.215 7.383 2.215"
    />
  </Svg>
)
