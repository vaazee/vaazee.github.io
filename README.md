Implemented a minimal classic Snake game with deterministic core logic and a simple canvas UI.








## Hosting 

https://tiiny.host/manage
https://snakegobble.tiiny.site/



**Files Added**
- `/Users/vaazee/Documents/New project/index.html`
- `/Users/vaazee/Documents/New project/styles.css`
- `/Users/vaazee/Documents/New project/snake.js`
- `/Users/vaazee/Documents/New project/main.js`

**Notes**
- Core logic is in `/Users/vaazee/Documents/New project/snake.js` with pure functions for deterministic stepping.
- No new dependencies were added.
- No tests were added because this repo has no test runner yet.

**Run Instructions**
1. From `/Users/vaazee/Documents/New project`, start a simple server:
   ```bash
   python3 -m http.server 5173
   ```
2. Open [http://localhost:5173](http://localhost:5173) in your browser.

**Manual Verification Checklist**
1. Controls: Arrow keys/WASD change direction; on-screen buttons work on mobile.
2. Pause/Restart: Space or Pause button toggles pause; Restart resets score and snake.
3. Boundaries: Hitting a wall ends the game; self-collision ends the game.
4. Growth & Score: Eating food increases length and score; food never spawns on the snake.

If you want tests, tell me which runner you prefer (or if you want a minimal no-deps test script), and I’ll add them.
