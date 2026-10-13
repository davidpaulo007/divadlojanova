/* =========================================================
   1. LIGAÇÃO À BASE DE DADOS SUPABASE
   ========================================================= */
const SUPABASE_URL = 'https://latdgssuihggttpfbsgr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-3I2dlowwEeFXfuWpljDPg_5uSWrjWN';

// Inicialização do cliente Supabase
const _supabase = (window.supabase && typeof window.supabase.createClient === 'function')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Função para guardar ou atualizar dados de morada/cliente no Supabase
async function guardarNoSupabase(dadosCliente) {
  if (!_supabase) {
    console.warn("Supabase ainda não foi carregado.");
    return;
  }
  try {
    const { data, error } = await _supabase
      .from('divadjewelry')
      .insert([
        { 
          nome: dadosCliente.nome || '',
          email: dadosCliente.email || '',
          morada: dadosCliente.morada || '',
          codigo_postal: dadosCliente.zip || '',
          telefone: dadosCliente.phone || ''
        }
      ]);

    if (error) {
      console.error("Erro ao guardar no Supabase:", error.message);
    } else {
      console.log("Morada e dados gravados com sucesso no Supabase!", data);
    }
  } catch (err) {
    console.error("Erro inesperado ao conectar ao Supabase:", err);
  }
}

/* =========================================================
   2. PRODUTOS E VARIÁVEIS DO SITE
   ========================================================= */
const products = [
 {id:1,name:"Audemar Piguet 41",category:"classic",desc:"Automático · Aço 316L",price:219,images:["imagens/audemarpiguetfrente.jpg", "imagens/audemarpiguetlado.jpg", "imagens/audemarpiguetbaixo.jpg"]},
 {id:2,name:"Swarovsky Hiperbola Colar ",category:"colares",desc:"Cronógrafo · Cerâmica",price:26,images:["imagens/colarmoca.jpg","imagens/colarunico.jpg", "imagens/colarproximo.jpg"]},
 {id:3,name:"Swarovsky Brinco Mola Matrix",category:"colares",desc:"Automático · Couro italiano",price:25,images:["imagens/brincomoca.jpg", "imagens/brincotras.jpg", "imagens/brincounico.jpg"]},
 {id:4,name:"Rolex Day-Date",category:"limited",desc:"Edição limitada · 18K",price:12900,images:["imagens/rolexazufrentel.jpg","imagens/rolexazullado.jpg","imagens/rolexazuldeitado.jpg"]},
 {id:5,name:"Riviera Sport",category:"sport",desc:"Automático · Titânio",price:7350,images:["imagens/relogio-riviera.png"]},
 {id:6,name:"Minimal 36",category:"classic",desc:"Quartzo suíço · Aço",price:3100,images:["imagens/relogio-minimal.jpg"]},
 {id:7,name:"Luna Édition",category:"limited",desc:"Edição limitada · Diamantes",price:15800,images:["imagens/relogio-luna.jpg"]},
 {id:8,name:"Aureum Diver",category:"sport",desc:"Automático · 300M",price:8100,images:["imagens/relogio-aureum-diver.jpg"]},
 {id:9,name:"Rolex ",category:"colares",desc:"Automático · 300M",price:8100,images:["imagens/datejustfrente.jpg", "imagens/datejustlado.jpg", "imagens/datejustdeitado.jpg"]}
];

let cart = [];
let activeImgIndex = 0;
const productsEl = document.querySelector("#products");
const euro = n => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

function renderProducts(filter = "all") {
  productsEl.innerHTML = products.filter(p => filter === "all" || p.category === filter).map(p => {
    const cover = p.images && p.images[0];
    return `
    <article class="product" data-id="${p.id}">
      <div class="product-img">${cover ? `<img src="${cover}" alt="${p.name}" loading="lazy">` : ""}${p.category === "limited" ? '<span class="badge">LIMITED</span>' : ""}</div>
      <div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><p class="price">${euro(p.price)}</p></div>
    </article>`;
  }).join("");
}

function renderCart() {
  const el = document.querySelector("#cartItems");
  if (!cart.length) {
    el.innerHTML = '<p class="empty">O seu saco está vazio.</p>';
  } else {
    el.innerHTML = cart.map((i, idx) => `<div class="cart-row"><div class="cart-thumb">${i.images && i.images[0] ? `<img src="${i.images[0]}" alt="${i.name}">` : ""}</div><div><h4>${i.name}</h4><p>${euro(i.price)}</p></div><button class="remove" data-remove="${idx}">×</button></div>`).join("");
  }
  document.querySelector("#cartCount").textContent = cart.length;
  document.querySelector("#cartTotal").textContent = euro(cart.reduce((s, i) => s + i.price, 0));
}

function openCart() { document.querySelector("#cart").classList.add("open"); document.querySelector("#overlay").classList.add("show"); }
function closeCart() { document.querySelector("#cart").classList.remove("open"); document.querySelector("#overlay").classList.remove("show"); }

function setMainImage(p, idx) {
  activeImgIndex = idx;
  document.querySelector("#pquickMainImg").src = p.images[idx];
  document.querySelectorAll("#pquickThumbs .pquick-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));
}

function openQuickView(id) {
  const p = products.find(x => x.id == id);
  if (!p) return;
  document.querySelector("#pquick").dataset.id = p.id;
  document.querySelector("#pquickName").textContent = p.name;
  document.querySelector("#pquickDesc").textContent = p.desc;
  document.querySelector("#pquickPrice").textContent = euro(p.price);
  const imgs = p.images && p.images.length ? p.images : [];
  document.querySelector("#pquickThumbs").innerHTML = imgs.map((src, i) => `<button class="pquick-thumb${i === 0 ? " active" : ""}" data-idx="${i}"><img src="${src}" alt="${p.name} - foto ${i + 1}"></button>`).join("");
  if (imgs.length) { document.querySelector("#pquickMainImg").src = imgs[0]; activeImgIndex = 0; }
  document.querySelector("#pquickNav").style.display = imgs.length > 1 ? "flex" : "none";
  document.querySelector("#pquick").classList.add("open");
  document.querySelector("#overlay").classList.add("show");
}

function closeQuickView() { document.querySelector("#pquick").classList.remove("open"); document.querySelector("#overlay").classList.remove("show"); }

function stepImage(dir) {
  const p = products.find(x => x.id == document.querySelector("#pquick").dataset.id);
  if (!p || !p.images || !p.images.length) return;
  const next = (activeImgIndex + dir + p.images.length) % p.images.length;
  setMainImage(p, next);
}

productsEl.addEventListener("click", e => { const card = e.target.closest(".product"); if (!card) return; openQuickView(card.dataset.id); });

document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  renderProducts(b.dataset.filter);
}));

document.querySelector("#openCart").onclick = openCart;
document.querySelector("#closeCart").onclick = closeCart;
document.querySelector("#overlay").onclick = () => { closeCart(); closeQuickView(); closeAccount(); };

document.querySelector("#cartItems").addEventListener("click", e => {
  const idx = e.target.dataset.remove;
  if (idx === undefined) return;
  cart = cart.filter((_, i) => i !== Number(idx));
  renderCart();
});

document.querySelector("#pquickClose").onclick = closeQuickView;
document.querySelector("#pquickThumbs").addEventListener("click", e => {
  const btn = e.target.closest(".pquick-thumb"); if (!btn) return;
  const p = products.find(x => x.id == document.querySelector("#pquick").dataset.id);
  setMainImage(p, Number(btn.dataset.idx));
});
document.querySelector("#pquickPrev").onclick = () => stepImage(-1);
document.querySelector("#pquickNext").onclick = () => stepImage(1);
document.querySelector("#pquickAdd").onclick = () => {
  const user = window.netlifyIdentity && netlifyIdentity.currentUser();
  if (!user) {
    closeQuickView();
    document.querySelector("#profileMsg") && (document.querySelector("#profileMsg").textContent = "");
    alert("Precisas de ter conta e sessão iniciada para adicionar produtos ao carrinho.");
    window.netlifyIdentity && netlifyIdentity.open("login");
    return;
  }
  const p = products.find(x => x.id == document.querySelector("#pquick").dataset.id);
  if (!p) return;
  cart.push(p); renderCart(); closeQuickView(); openCart();
};

document.querySelector("#checkout").onclick = fazerEncomenda;
document.querySelector("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  document.querySelector("#newsletterMsg").textContent = "Obrigado — está na lista privada.";
  e.target.reset();
});

/* ---------- Conta / Login (Netlify Identity + Supabase Sync) ---------- */
function openAccount() { document.querySelector("#accountPanel").classList.add("open"); document.querySelector("#overlay").classList.add("show"); }
function closeAccount() { document.querySelector("#accountPanel").classList.remove("open"); document.querySelector("#overlay").classList.remove("show"); }

function fillProfileForm(user) {
  const d = (user && user.user_metadata) || {};
  document.querySelector("#pf-name").value = d.full_name || "";
  document.querySelector("#pf-phone").value = d.phone || "";
  document.querySelector("#pf-address").value = d.address || "";
  document.querySelector("#pf-zip").value = d.zip || "";
  document.querySelector("#pf-city").value = d.city || "";
  document.querySelector("#pf-country").value = d.country || "";
}

function updateAuthUI(user) {
  const btn = document.querySelector("#accountBtn");
  if (user) {
    const firstName = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name.split(" ")[0] : user.email.split("@")[0];
    btn.textContent = firstName;
    document.querySelector("#accountEmail").textContent = user.email;
    fillProfileForm(user);
  } else {
    btn.textContent = "Entrar";
  }
}

if (window.netlifyIdentity) {
  netlifyIdentity.on("init", user => updateAuthUI(user));
  netlifyIdentity.on("login", user => {
    updateAuthUI(user);
    netlifyIdentity.close();
    openAccount();
    // Envia registo básico para o Supabase ao fazer Login
    if (user) {
      guardarNoSupabase({
        nome: user.user_metadata ? user.user_metadata.full_name : '',
        email: user.email,
        morada: user.user_metadata ? user.user_metadata.address : ''
      });
    }
  });
  netlifyIdentity.on("logout", () => { updateAuthUI(null); closeAccount(); });
  netlifyIdentity.init();
}

document.querySelector("#accountBtn").addEventListener("click", () => {
  if (!window.netlifyIdentity) { alert("O login só funciona depois de o site estar publicado no Netlify com a Identity ativada."); return; }
  const user = netlifyIdentity.currentUser();
  if (user) { openAccount(); } else { netlifyIdentity.open(); }
});

document.querySelector("#closeAccount").onclick = closeAccount;
document.querySelector("#logoutBtn").onclick = () => window.netlifyIdentity && netlifyIdentity.logout();

/* ---------- SUBMISSÃO DO PERFIL / MORADA (INTEGRAÇÃO COM SUPABASE) ---------- */
document.querySelector("#profileForm").addEventListener("submit", async e => {
  e.preventDefault();
  const identity = window.netlifyIdentity;
  const user = identity && identity.currentUser();
  const msg = document.querySelector("#profileMsg");
  
  if (!user) {
    msg.style.color = "#c0392b";
    msg.textContent = "A tua sessão expirou. Fecha e volta a iniciar sessão.";
    return;
  }

  const nome = document.querySelector("#pf-name").value;
  const phone = document.querySelector("#pf-phone").value;
  const address = document.querySelector("#pf-address").value;
  const zip = document.querySelector("#pf-zip").value;
  const city = document.querySelector("#pf-city").value;
  const country = document.querySelector("#pf-country").value;

  const fullAddress = `${address}${city ? ', ' + city : ''}${country ? ', ' + country : ''}`;

  const data = {
    full_name: nome,
    phone: phone,
    address: address,
    zip: zip,
    city: city,
    country: country
  };

  msg.style.color = "#777";
  msg.textContent = "A guardar...";

  try {
    // 1. Atualiza no Netlify Identity
    await user.jwt(true);
    await user.update({ data });

    // 2. ENVIA DIRETO PARA O SUPABASE (Base de dados central)
    await guardarNoSupabase({
      nome: nome,
      email: user.email,
      morada: fullAddress,
      zip: zip,
      phone: phone
    });

    msg.style.color = "#5e8f5e";
    msg.textContent = "Dados guardados com sucesso!";
  } catch (err) {
    console.error("Erro ao guardar perfil:", err);
    msg.style.color = "#c0392b";
    msg.textContent = "Erro ao guardar" + (err && err.message ? ": " + err.message : ". Tenta novamente.");
  }
});

renderProducts(); renderCart();

/* ---------- Encomenda por WhatsApp ---------- */
// >>> COLOCA AQUI O TEU NÚMERO DE WHATSAPP <<<
// Código do país + número, só dígitos, sem espaços nem "+". Exemplo (Portugal): "351912345678"
const WHATSAPP_NUMBER = "351000000000";

function cartTotalValue() { return cart.reduce((s, i) => s + i.price, 0); }

function fazerEncomenda() {
  if (!cart.length) { alert("O teu carrinho está vazio."); return; }

  const user = window.netlifyIdentity && netlifyIdentity.currentUser();
  if (!user) {
    alert("Precisas de iniciar sessão para fazer a encomenda.");
    window.netlifyIdentity && netlifyIdentity.open("login");
    return;
  }

  if (!/^\d{9,15}$/.test(WHATSAPP_NUMBER) || WHATSAPP_NUMBER === "351000000000") {
    alert("O número de WhatsApp da loja ainda não foi configurado no script.js.");
    return;
  }

  const d = user.user_metadata || {};
  const linhas = cart.map((i, n) => `${n + 1}. ${i.name.trim()} - ${euro(i.price)}`);
  const morada = [d.address, d.zip, d.city, d.country].filter(Boolean).join(", ");
  const texto = [
    "Olá! Gostaria de fazer uma encomenda:",
    "",
    ...linhas,
    "",
    "Total: " + euro(cartTotalValue()),
    "",
    "Nome: " + (d.full_name || "-"),
    "Email: " + user.email,
    "Telefone: " + (d.phone || "-"),
    "Morada: " + (morada || "-")
  ].join("\n");

  // Abre o WhatsApp já com a mensagem pronta (tem de ser logo ao clicar, para o navegador não bloquear)
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto), "_blank");

  registarEncomenda(user);
}

// Guarda a encomenda na conta do cliente, para aparecer no teu painel admin.html (separador Encomendas)
async function registarEncomenda(user) {
  const order = {
    id: "ORD-" + Date.now(),
    items: cart.map(i => ({ name: i.name, price: i.price })),
    total: cartTotalValue(),
    method: "whatsapp",
    status: "pendente",
    date: new Date().toISOString()
  };
  cart = []; renderCart(); closeCart();
  try {
    await user.jwt(true);
    const existing = (user.user_metadata && user.user_metadata.orders) || [];
    await user.update({ data: { orders: [...existing, order] } });
  } catch (e) { console.error("Não foi possível guardar o registo da encomenda:", e); }
}
