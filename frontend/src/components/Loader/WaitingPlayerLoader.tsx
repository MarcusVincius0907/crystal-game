import { Overlay } from "../Overlay/Overlay";

export function WaitingPlayerLoader() {
    return (
        <Overlay>
            <div className="flex justify-center items-center flex-col">
                <span className="spinner"></span>
                <p className="text-white text-2xl mt-3">Aguardando a jogada do seu oponente...</p>
            </div>
        </Overlay>
    )
}