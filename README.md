# Request Manager

Request manager de mesa (estilo Bruno/Postman/Insomnia), feito com Tauri 2 + React + TypeScript.

> ⚠️ Projeto pessoal feito apenas para aprender Tauri/Rust/React na prática. Não é
> produto, não tem garantia de nada funcionar direito, e vai evoluir (ou não) conforme
> o tempo/vontade permitir.

## Features atuais

- Collections e requests (criar, renomear, apagar)
- Editor de request: método, URL, query params, headers, body
- Envio real da request e visualização de status/tempo/tamanho/corpo da resposta
- Ambientes com variáveis (`{{nome}}`) substituídas na URL/headers/body ao enviar
- Persistência local em arquivo (sobrevive a reiniciar o app)

## Rodando em dev

```
npm install
npm run tauri:dev
```

Use `tauri:dev` em vez de `tauri dev` direto — no Hyprland/Wayland o WebKitGTK quebra com
`Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display` sem a variável
`WEBKIT_DISABLE_DMABUF_RENDERER=1`, que esse script já seta.

## Stack

- [Tauri 2](https://tauri.app/) (Rust) como shell nativo
- React + TypeScript + Vite no front-end
- Estado em Context + `useReducer` (sem lib externa)
- `tauri-plugin-store` para persistência local

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
