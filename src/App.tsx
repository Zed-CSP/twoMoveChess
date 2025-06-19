import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import './App.css';

interface GameState {
  game: Chess;
  movesThisTurn: number;
  capturedLastMove: boolean;
  currentPlayer: 'w' | 'b';
  gameOver: boolean;
  winner: string | null;
}

function App() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    game: new Chess(),
    movesThisTurn: 0,
    capturedLastMove: false,
    currentPlayer: 'w',
    gameOver: false,
    winner: null
  }));

  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Check for game over conditions
  useEffect(() => {
    const { game, gameOver } = gameState;
    if (!gameOver) {
      if (game.isCheckmate()) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          winner: game.turn() === 'w' ? 'Black' : 'White'
        }));
      } else if (game.isDraw() || game.isStalemate()) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          winner: 'Draw'
        }));
      }
    }
  }, [gameState]);

  const highlightSquare = (square: string) => {
    setSelectedSquare(square);
    const moves = gameState.game.moves({ square: square as any, verbose: true });
    setPossibleMoves(moves.map((move: any) => move.to));
  };

  const clearHighlights = () => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const makeMove = useCallback((sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(gameState.game.fen());
    
    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move === null) return false;

      // Check if this move captured a piece
      const capturedPiece = move.captured !== undefined;
      
      setGameState(prev => {
        const newMovesThisTurn = prev.movesThisTurn + 1;
        
        // Determine if we should switch turns
        let shouldSwitchTurn = false;
        if (capturedPiece) {
          // If we captured a piece, always switch turn (opponent gets 2 moves)
          shouldSwitchTurn = true;
        } else if (newMovesThisTurn >= 2) {
          // Made 2 moves already
          shouldSwitchTurn = true;
        } else if (newMovesThisTurn >= 1 && !prev.capturedLastMove) {
          // Made 1 move and opponent didn't capture in their last turn
          shouldSwitchTurn = true;
        }

        // Important: We need to update whose turn it is in the chess.js game object
        if (!shouldSwitchTurn) {
          // If we're not switching turns, we need to manually switch back the turn in chess.js
          // because chess.js automatically switches turns after each move
          const fen = gameCopy.fen();
          const fenParts = fen.split(' ');
          // The player who just moved should continue playing
          fenParts[1] = prev.currentPlayer;
          gameCopy.load(fenParts.join(' '));
        }

        return {
          game: gameCopy,
          movesThisTurn: shouldSwitchTurn ? 0 : newMovesThisTurn,
          // When switching turns, the opponent should know if we captured
          capturedLastMove: shouldSwitchTurn ? capturedPiece : prev.capturedLastMove,
          currentPlayer: shouldSwitchTurn ? gameCopy.turn() : prev.currentPlayer,
          gameOver: prev.gameOver,
          winner: prev.winner
        };
      });

      // Update move history
      const notation = move.san;
      setMoveHistory(prev => [...prev, notation]);

      clearHighlights();
      return true;
    } catch (error) {
      return false;
    }
  }, [gameState]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    return makeMove(sourceSquare, targetSquare);
  };

  const onSquareClick = (square: string) => {
    if (selectedSquare === null) {
      // First click - select piece
      const piece = gameState.game.get(square as any);
      if (piece && piece.color === gameState.currentPlayer) {
        highlightSquare(square);
      }
    } else {
      // Second click - try to move
      if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square);
      } else {
        // Click on another piece
        const piece = gameState.game.get(square as any);
        if (piece && piece.color === gameState.currentPlayer) {
          highlightSquare(square);
        } else {
          clearHighlights();
        }
      }
    }
  };

  const resetGame = () => {
    setGameState({
      game: new Chess(),
      movesThisTurn: 0,
      capturedLastMove: false,
      currentPlayer: 'w',
      gameOver: false,
      winner: null
    });
    setMoveHistory([]);
    clearHighlights();
  };

  const customSquareStyles: { [key: string]: React.CSSProperties } = {};
  
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)'
    };
  }
  
  possibleMoves.forEach(square => {
    customSquareStyles[square] = {
      background: gameState.game.get(square as any) 
        ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
        : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      borderRadius: '50%'
    };
  });

  // Calculate moves remaining based on whether opponent captured last turn
  const maxMovesThisTurn = gameState.capturedLastMove ? 2 : 1;
  const movesRemaining = maxMovesThisTurn - gameState.movesThisTurn;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Two-Move Chess</h1>
        <p className="subtitle">Capture a piece, give your opponent two moves!</p>
      </header>

      <div className="game-container">
        <div className="board-section">
          <Chessboard
            position={gameState.game.fen()}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardWidth={500}
            arePiecesDraggable={!gameState.gameOver}
            isDraggablePiece={({ piece }) => {
              // Only allow dragging pieces of the current player
              return piece[0] === gameState.currentPlayer;
            }}
          />
        </div>

        <div className="info-section">
          <div className="game-status">
            {gameState.gameOver ? (
              <div className="game-over">
                <h2>Game Over!</h2>
                <p>{gameState.winner === 'Draw' ? "It's a draw!" : `${gameState.winner} wins!`}</p>
                <button onClick={resetGame} className="new-game-btn">New Game</button>
              </div>
            ) : (
              <>
                <div className="current-turn">
                  <h3>Current Turn: {gameState.currentPlayer === 'w' ? 'White' : 'Black'}</h3>
                  <p>Moves remaining this turn: {movesRemaining}</p>
                  {gameState.capturedLastMove && gameState.movesThisTurn === 0 && (
                    <p className="bonus-moves">Bonus turn! (Opponent captured a piece)</p>
                  )}
                  {gameState.game.inCheck() && (
                    <p className="check-warning">Check!</p>
                  )}
                </div>
                <button onClick={resetGame} className="new-game-btn">New Game</button>
              </>
            )}
          </div>

          <div className="move-history">
            <h3>Move History</h3>
            <div className="moves-list">
              {moveHistory.map((move, index) => (
                <span key={index} className="move">
                  {index % 2 === 0 && `${Math.floor(index / 2) + 1}. `}
                  {move}{' '}
                </span>
              ))}
            </div>
          </div>

          <div className="rules">
            <h3>Rules</h3>
            <ul>
              <li>Standard chess rules apply</li>
              <li>If you capture a piece, your opponent gets TWO moves</li>
              <li>Maximum 2 consecutive moves per turn</li>
              <li>Game ends on checkmate or king capture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
