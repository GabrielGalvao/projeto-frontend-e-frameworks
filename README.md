# CicloLocal

Projeto acadêmico de frontend sobre a ODS 12 (Consumo e produção responsáveis). O site possui quatro páginas navegáveis, usa Bootstrap 5, CSS próprio e um mapa interativo com Leaflet e OpenStreetMap.

## Páginas

- `index.html`: início com mapa e prévia das iniciativas.
- `servicos.html`: diretório com busca, filtro por causa, contatos demonstrativos e mapa.
- `sobre.html`: apresentação do projeto e da ODS 12.
- `cadastro.html`: formulário com validação no navegador.

Os nomes, endereços, telefones e e-mails do mapa são fictícios e servem apenas para demonstração. O formulário não envia nem armazena dados. Bootstrap, Leaflet, ícones, fontes e mapas precisam de conexão com a internet.

## Como executar

Abra `index.html` no navegador ou inicie um servidor local na pasta do projeto:

```powershell
py -m http.server 8000
```

Depois acesse `http://localhost:8000`.