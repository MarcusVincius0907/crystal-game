import { Board } from "./Board/Board";

export function Panel(props: { panel: any, isUserPanel: boolean, isActive: boolean }) {
    

    return (
        <div className="flex gap-2">
            {props.panel.map((board: any, index: number) => (
                <Board key={index} board={board} boardIndex={index} isPanelActive={props.isActive} isUserPanel={props.isUserPanel} />
            ))}
        </div>
    )
}