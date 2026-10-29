# Request Manager

Request manager de mesa (estilo Bruno/Postman/Insomnia), feito com Tauri 2 + React + TypeScript.

## Rodando em dev

```
npm run tauri:dev
```

Use `tauri:dev` em vez de `tauri dev` direto — no Hyprland/Wayland o WebKitGTK quebra com
`Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display` sem a variável
`WEBKIT_DISABLE_DMABUF_RENDERER=1`, que esse script já seta.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
