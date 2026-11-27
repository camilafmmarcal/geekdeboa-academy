# Etapa 15 — Simulados demonstrativos

Este pacote contém arquivos completos para copiar sobre os caminhos correspondentes no projeto.
**Não substitua App.tsx nem swagger.ts**: use os arquivos .patch.txt como instruções.

## Procedimento
1. Faça commit de backup.
2. Copie `backend/src/repositories/simuladoRepository.ts`, `services/simuladoService.ts`, `controllers/simuladoController.ts`, `routes/simuladoRoutes.ts`.
3. Copie `frontend/src/services/simuladoService.ts`, `pages/Simulados.tsx`, `styles/simulados.css`.
4. No `frontend/src/App.tsx`, importe `Simulados` e substitua a rota provisória por `<Route path="simulados" element={<Simulados />} />`.
5. Documente o POST no Swagger.
6. Rode `npm run build` em backend e frontend, depois `npm run dev` em ambos.
7. Acesse /simulados e teste conclusão com zero, algumas e todas as respostas; teste IDs inválidos e alternativa de outra questão.

## API
POST `/api/simulados/:id/finalizar`
JSON `{"respostas":[{"questao_id":1,"alternativa_id":5}]}`
Questões omitidas contam como erradas. O retorno inclui a correção comentada **apenas após a submissão**.

## Limites
Este é um **modo de demonstração**, sem autenticação, persistência nem controle antifraude. O cronômetro usa o relógio do navegador e pode reiniciar após atualização da página. Não usar como avaliação oficial.
