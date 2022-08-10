import { Screen } from '../utils/device'
import responsive from "../resources/responsive";
export default {
    micro: Screen.width > 320 ? 12 : 10,
    small: responsive.h(14),
    medium: responsive.h(16),
    larg: responsive.h(20),
    default: responsive.h(9)
}