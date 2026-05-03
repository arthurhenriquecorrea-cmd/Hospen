# MinhaLoja — Loja Virtual Completa

Site de loja virtual completo com catálogo, carrinho de compras e checkout, desenvolvido com HTML, CSS e JavaScript puro.

## ✅ Funcionalidades Implementadas

- **Página inicial (Home):** Hero section animado, banner de benefícios, grade de categorias, produtos em destaque, seção mais vendidos, banner promocional, depoimentos e newsletter
- **Catálogo de produtos:** Grid de produtos com filtros por categoria, preço e tipo, ordenação (preço, avaliação, comentários), busca por texto, paginação e contagem de resultados
- **Carrinho lateral:** Adicionar/remover produtos, alterar quantidades, cálculo de subtotal e frete, acesso ao checkout
- **Checkout completo:** Formulário de dados pessoais com máscara (CPF, telefone, CEP), endereço com auto-preenchimento via ViaCEP, métodos de pagamento (cartão de crédito, débito e PIX), parcelamento, cupons de desconto, validação de formulário
- **Página de confirmação:** Número de pedido, previsão de entrega, confirmação visual
- **Design responsivo:** Mobile-first, layout adaptável para celular, tablet e desktop
- **Persistência:** Carrinho salvo no localStorage entre sessões

## 📁 Estrutura de Arquivos

```
index.html          → Página inicial
catalog.html        → Catálogo de produtos
checkout.html       → Checkout / finalização de compra
success.html        → Confirmação do pedido

css/
  style.css         → Todos os estilos

js/
  store.js          → Dados dos produtos, categorias e helpers
  cart.js           → Lógica do carrinho de compras
  main.js           → Inicialização da home
  catalog.js        → Lógica do catálogo (filtros, paginação, busca)
  checkout.js       → Lógica do checkout (validação, máscaras, CEP)
```

## 🌐 URLs / Rotas

| Página | URL | Parâmetros |
|--------|-----|-----------|
| Home | `/index.html` | — |
| Catálogo | `/catalog.html` | `?category=eletronicos`, `?filter=sale`, `?filter=new`, `?search=termo` |
| Checkout | `/checkout.html` | — |
| Confirmação | `/success.html` | `?order=ML12345678` |

## 🛒 Cupons de Desconto

| Cupom | Desconto |
|-------|---------|
| `DESCONTO10` | 10% off |
| `PRIMEIRA` | 10% off |
| `FRETE` | Frete grátis |
| `MINHALOJA20` | 20% off |

## 🎨 Personalização

Para personalizar o site, edite:

- **Nome da loja:** Buscar por `MinhaLoja` em todos os arquivos HTML
- **Produtos:** Editar o array `PRODUCTS` em `js/store.js`
- **Categorias:** Editar o array `CATEGORIES` em `js/store.js`
- **Cores:** Editar as variáveis CSS no `:root` em `css/style.css`
- **Frete grátis:** Editar `freeShippingThreshold` em `js/store.js`
- **Contato / WhatsApp:** Atualizar links no footer dos HTMLs

## ⚙️ Configurações da Loja (`js/store.js`)

```javascript
const STORE_CONFIG = {
  name: 'MinhaLoja',
  currency: 'BRL',
  freeShippingThreshold: 150,   // Valor mínimo para frete grátis
  shippingCost: 15.90,          // Custo do frete
};
```

## 🚀 Próximos Passos Sugeridos

- [ ] Integrar com gateway de pagamento real (Stripe, PagSeguro, Mercado Pago)
- [ ] Adicionar página de produto individual com galeria de imagens
- [ ] Implementar lista de favoritos (wishlist)
- [ ] Adicionar rastreamento de pedidos
- [ ] Integrar com sistema de estoque
- [ ] Implementar login/conta do cliente
- [ ] Adicionar avaliações e reviews de produtos
- [ ] Configurar e-mail transacional (confirmação de pedido)
- [ ] Adicionar chat de suporte (WhatsApp, Zendesk, etc.)
- [ ] Implementar comparador de produtos

## 🔧 Tecnologias Usadas

- HTML5 semântico
- CSS3 com variáveis, Grid e Flexbox
- JavaScript vanilla (sem frameworks)
- Font Awesome 6 (ícones)
- Google Fonts — Inter
- ViaCEP API (auto-preenchimento de endereço)
- localStorage (persistência do carrinho)
