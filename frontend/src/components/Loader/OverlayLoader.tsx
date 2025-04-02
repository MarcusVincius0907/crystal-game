import { Overlay } from '../Overlay/Overlay'
import './OverlayLoader.css'

export function OverlayLoader() {
    return (
        <Overlay>
            <span className="spinner"></span>
        </Overlay>
    )
}