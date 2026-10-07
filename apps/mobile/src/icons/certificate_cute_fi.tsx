// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const CertificateCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M10.586 2.101a2 2 0 0 1 2.828 0l1.9 1.9H18a2 2 0 0 1 2 2v2.686l1.9 1.9a2 2 0 0 1 0 2.828l-1.9 1.9V18a2 2 0 0 1-2 2h-2.687l-1.9 1.9a2 2 0 0 1-2.827 0l-1.9-1.9H6a2 2 0 0 1-2-2v-2.687l-1.9-1.9a2 2 0 0 1 0-2.827l1.9-1.9V6.001a2 2 0 0 1 2-2h2.686zm5.907 6.882a1 1 0 0 0-1.414 0l-4.244 4.245l-1.769-1.768a1 1 0 0 0-1.414 1.415l2.476 2.474a1 1 0 0 0 1.414 0l4.951-4.952a1 1 0 0 0 0-1.414"
    />
  </Svg>
)
