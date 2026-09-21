import type { JSX } from 'react';
import { useGameStore } from '../store/gameStore';
import { SplashScreen } from './screens/SplashScreen';
import { OpponentSelect } from './screens/OpponentSelect';
import { GameScreen } from './screens/GameScreen';

export default function App(): JSX.Element {
  const screen = useGameStore((s) => s.screen);

  return (
    <main className="app" data-testid="app-container">
      {screen === 'splash' && <SplashScreen />}
      {screen === 'select' && <OpponentSelect />}
      {screen === 'game' && <GameScreen />}
    </main>
  );
}
