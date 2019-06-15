export interface Game {
    update: () => void,
    render: () => void,
    onMessage?: (message: string) => void
}