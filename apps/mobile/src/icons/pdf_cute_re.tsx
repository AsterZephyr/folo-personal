// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PdfCuteReIcon = ({
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
      d="M13 3v5.5a.5.5 0 0 0 .5.5H19m-7 3l-.074.468a6 6 0 0 1-2.156 3.734l-.368.298l.442-.17a6 6 0 0 1 4.31 0l.444.17l-.37-.299a6 6 0 0 1-2.155-3.732zm1.586-9H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.414a1 1 0 0 0-.293-.707l-4.414-4.414A1 1 0 0 0 13.586 3Z"
    />
  </Svg>
)
