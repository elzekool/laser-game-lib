import {Renderer} from './Renderer';

export interface Game {
  update: () => void;
  render: (renderer: Renderer) => void;
  onMessage?: (message: string) => void;
  getWelcomeMessage?: () => string | null;
  getMessage?: () => string | null;
}
