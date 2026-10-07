// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const ThoughtCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12.923 2.885A4.46 4.46 0 0 0 8.726 5.83a4.463 4.463 0 0 0-1.048 8.492a4.462 4.462 0 0 0 6.87 1.707a4.462 4.462 0 0 0 6.296-3.956a4.462 4.462 0 0 0-4.309-7.344a4.46 4.46 0 0 0-3.612-1.844M5 16c-.748 0-1.463.226-2.014.64C2.434 17.052 2 17.7 2 18.5s.434 1.447.986 1.86c.55.414 1.266.64 2.014.64s1.463-.226 2.014-.64C7.566 19.948 8 19.3 8 18.5s-.434-1.447-.986-1.86C6.464 16.225 5.748 16 5 16"
    />
  </Svg>
)
