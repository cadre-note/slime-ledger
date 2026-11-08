# 史萊姆記帳

手機用的療癒記帳 PWA（資料只存在本機）。線上版：https://cadre-note.github.io/slime-ledger/

## 結構
- `index.html`、`sw.js`、`manifest.webmanifest`、圖示：上線的成品（GitHub Pages 直接讀）
- `src/`：原始碼（React + Tailwind，單檔輸出）
  - `App.jsx` 主程式、`Face.jsx` 表情、`bodies.js` 角色圖、`PhotoIcons.jsx` 項目圖示
  - `build.py` 打包腳本

## 修改流程
1. `cd src && npm install`
2. 改 `App.jsx` 等檔案
3. `python3 build.py`（輸出到上一層的 `index.html`）
4. 把 `sw.js` 的快取版本號 +1（例如 v31 → v32），commit 並 push
