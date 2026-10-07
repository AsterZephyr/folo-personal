// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PlayCuteReIcon = ({
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
      d="M6.661 4.88a.47.47 0 0 1 .656-.378c1.032.441 3.375 1.502 6.354 3.222s5.071 3.22 5.97 3.893a.468.468 0 0 1 0 .755c-.889.667-2.954 2.148-5.97 3.89c-3.019 1.742-5.334 2.79-6.356 3.226a.468.468 0 0 1-.653-.378c-.135-1.11-.389-3.662-.389-7.116c0-3.452.254-6.003.388-7.115Z"
    />
  </Svg>
)
