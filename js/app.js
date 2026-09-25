import { restaurants } from "./data.js";

const state = {
  restaurant: null,
  cart: [],
  activeCategory: "all",
  productBeingConfigured: null,
  productOptions: [],
  selectedOptions: [],
  orderType: null,
  paymentMethod: null
};

const $ = (selector) => document.querySelector(selector);

function getRestaurantSlug() {
  // Demo:
  // /lKb-smash
  // Si no hay slug, usamos el local de ejemplo.
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0] || "lKb-smash";
}

function init() {
  const slug = getRestaurantSlug();
  state.restaurant = restaurants[slug] || restaurants["lKb-smash"];

  renderHeader();
  renderStatus();
  renderFeaturedProduct();
  renderCategories();
  renderMenu();
  renderGoogleReviews();
  renderSocialLinks();
  renderCartBar();
  bindGlobalEvents();
}

function money(value) {
  return new Intl.NumberFormat(state.restaurant.locale, {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value).replace("UYU", "$");
}

function parseMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isNowInsideRange(open, close, nowMinutes) {
  const start = parseMinutes(open);
  let end = parseMinutes(close);

  // "00:00" significa medianoche del día siguiente.
  if (end === 0) end = 24 * 60;

  if (end <= start) {
    return nowMinutes >= start || nowMinutes < end;
  }

  return nowMinutes >= start && nowMinutes < end;
}

function getOpenState() {
  const restaurant = state.restaurant;

  if (!restaurant.acceptingOrders) {
    return {
      open: false,
      reason: "paused",
      label: "Pedidos pausados"
    };
  }

  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const ranges = restaurant.schedule[day] || [];

  const open = ranges.some(range =>
    isNowInsideRange(range.open, range.close, minutes)
  );

  if (open) {
    return {
      open: true,
      reason: "open",
      label: "Estamos tomando pedidos"
    };
  }

  const nextOpening = findNextOpening(now);
  return {
    open: false,
    reason: "closed",
    label: nextOpening
      ? `Pedidos cerrados · Próxima apertura ${nextOpening}`
      : "Pedidos cerrados"
  };
}

function canPlaceOrders() {
  return getOpenState().open
    || (state.restaurant.whatsappTesting?.enabled && Boolean(getOrderWhatsAppNumber()));
}

function findNextOpening(fromDate) {
  for (let offset = 0; offset <= 7; offset++) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + offset);

    const ranges = state.restaurant.schedule[date.getDay()] || [];
    if (!ranges.length) continue;

    const first = ranges[0];
    const candidate = new Date(date);
    const [h, m] = first.open.split(":").map(Number);
    candidate.setHours(h, m, 0, 0);

    if (candidate > fromDate) {
      const dayName = candidate.toLocaleDateString("es-UY", { weekday: "long" });
      return `${dayName} a las ${first.open}`;
    }
  }

  return null;
}

function renderHeader() {
  document.title = `${state.restaurant.name} · Menú digital`;
  const brandMark = state.restaurant.logo
    ? `<img class="brand-logo" src="${state.restaurant.logo}" alt="Logo de ${state.restaurant.name}">`
    : `<div class="brand-mark" aria-hidden="true">${state.restaurant.name.charAt(0)}</div>`;

  $("#restaurant-header").innerHTML = `
    <div class="header-inner">
      ${brandMark}
      <div class="brand-copy">
        <span class="brand-eyebrow">MENÚ DEL LOCAL</span>
        <h1>${state.restaurant.name}</h1>
        <p>${state.restaurant.tagline}</p>
      </div>
    </div>
  `;
}

function renderStatus() {
  const status = getOpenState();
  const message = status.open
    ? "Armá tu pedido y lo enviás por WhatsApp."
    : status.label;

  $("#restaurant-status").innerHTML = `
    <div class="status ${status.open ? "is-open" : "is-closed"}">
      <span class="status-dot" aria-hidden="true"></span>
      <div>
        <strong>${status.open ? "Estamos tomando pedidos" : "Ahora estamos cerrados"}</strong>
        <p>${message}</p>
      </div>
      <span class="status-note">${status.open ? "ABIERTO" : "CERRADO"}</span>
    </div>
  `;
}

function renderFeaturedProduct() {
  const section = $("#featured-product");
  const feature = state.restaurant.featuredProduct;
  const product = state.restaurant.products.find(
    item => item.id === feature?.productId
  );

  if (!feature || !product) {
    section.classList.add("hidden");
    section.innerHTML = "";
    return;
  }

  const visuals = {
    fries: "🍟",
    drinks: "🥤",
    combos: "🍔",
    burgers: "🍔"
  };
  const visual = product.image
    ? `<img src="${product.image}" alt="" loading="lazy">`
    : `<span aria-hidden="true">${visuals[product.categoryId] || "🍽️"}</span>`;
  const open = getOpenState().open;
  const canOrder = canPlaceOrders();

  section.classList.remove("hidden");
  section.innerHTML = `
    <article class="featured-banner">
      <div class="featured-copy">
        <span class="featured-eyebrow">${feature.eyebrow || "RECOMENDADO POR LA CASA"}</span>
        <h2>${product.name}</h2>
        <p>${feature.message || product.description}</p>
        <div class="featured-actions">
          <strong class="featured-price">${money(product.price)}</strong>
          <button class="featured-button" data-featured-product ${canOrder ? "" : "disabled"}>
            ${canOrder ? "Lo quiero" : "Pedidos cerrados"}
          </button>
        </div>
      </div>
      <div class="featured-visual">${visual}</div>
    </article>
  `;

  section.querySelector("[data-featured-product]").addEventListener("click", () => {
    if (canPlaceOrders()) openProduct(product);
  });
}

function renderCategories() {
  const categories = [
    { id: "all", name: "Todo" },
    ...state.restaurant.categories
  ];

  $("#categories").innerHTML = `
    <nav class="categories" aria-label="Categorías">
      ${categories.map(category => `
        <button
          class="${state.activeCategory === category.id ? "active" : ""}"
          data-category="${category.id}">
          ${category.name}
        </button>
      `).join("")}
    </nav>
  `;

  $("#categories").querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

function getVisibleProducts() {
  if (state.activeCategory === "all") {
    return state.restaurant.products;
  }

  return state.restaurant.products.filter(
    product => product.categoryId === state.activeCategory
  );
}

function burgerComboIncludesText() {
  const included = state.restaurant.burgerAndComboIncludes || [];
  return included.length
    ? `Incluye ${included.join(" y ").toLowerCase()}.`
    : "";
}

function hasIncludedFries(product) {
  return product.categoryId === "burgers" || product.categoryId === "combos";
}

function renderMenu() {
  const products = getVisibleProducts();

  $("#menu").innerHTML = `
    <div class="menu-heading">
      <div>
        <span class="section-eyebrow">HECHO PARA DISFRUTAR</span>
        <h2>Elegí tus favoritos</h2>
      </div>
      <span class="menu-count">${products.length} opciones</span>
    </div>
    <div class="menu-list">
      ${products.map(product => productCard(product)).join("")}
    </div>
  `;

  $("#menu").querySelectorAll("[data-product-id]").forEach(button => {
    button.addEventListener("click", () => {
      const product = state.restaurant.products.find(
        item => item.id === button.dataset.productId
      );

      if (!canPlaceOrders()) return;

      openProduct(product);
    });
  });
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function getWhatsAppUrl() {
  const configuredUrl = safeExternalUrl(state.restaurant.whatsappUrl);
  if (configuredUrl) return configuredUrl;

  const phone = String(state.restaurant.whatsapp || "").replace(/\D/g, "");
  return phone.length >= 8 && phone.length <= 15 ? `https://wa.me/${phone}` : "";
}

function getOrderWhatsAppNumber() {
  const testing = state.restaurant.whatsappTesting;
  const number = testing?.enabled ? testing.number : state.restaurant.whatsapp;
  const normalized = String(number || "").replace(/\D/g, "");

  return normalized.length >= 8 && normalized.length <= 15 ? normalized : "";
}

function renderGoogleReviews() {
  const section = $("#google-reviews");
  const reviewUrl = safeExternalUrl(state.restaurant.googleReviewUrl)
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(state.restaurant.name)}`;

  section.innerHTML = `
    <div class="review-invite">
      <div class="review-copy">
        <span class="review-eyebrow">GOOGLE</span>
        <h2>¿Cómo estuvo tu experiencia?</h2>
        <p>Tu reseña ayuda a que más personas descubran ${state.restaurant.name}.</p>
      </div>
      <a class="review-link" href="${reviewUrl}" target="_blank" rel="noopener noreferrer">
        Dejar una reseña <span aria-hidden="true">↗</span>
      </a>
    </div>
  `;
}

function renderSocialLinks() {
  const section = $("#social-links");
  const links = [
    { label: "Instagram", href: safeExternalUrl(state.restaurant.instagramUrl) },
    { label: "WhatsApp", href: getWhatsAppUrl() }
  ].filter(link => link.href);

  if (!links.length) {
    section.classList.add("hidden");
    section.innerHTML = "";
    return;
  }

  section.classList.remove("hidden");
  section.innerHTML = `
    <span class="social-heading">Seguinos y contactanos</span>
    <nav class="social-links-list" aria-label="Redes sociales">
      ${links.map(link => `
        <a class="social-link" href="${link.href}" target="_blank" rel="noopener noreferrer">
          ${link.label} <span aria-hidden="true">↗</span>
        </a>
      `).join("")}
    </nav>
  `;
}

function productCard(product) {
  const tags = product.tags?.length
    ? `<div class="tags">${product.tags.map(tag => `<span>${tag === "popular" ? "MÁS PEDIDO" : tag === "signature" ? "DE LA CASA" : tag === "combo" ? "COMBO" : tag === "kids" ? "IDEAL PARA CHICOS" : tag === "extra" ? "EXTRA" : tag}</span>`).join("")}</div>`
    : "";
  const visuals = {
    fries: "🍟",
    drinks: "🥤",
    combos: "🍔",
    burgers: "🍔"
  };
  const visual = product.image
    ? `<img src="${product.image}" alt="" loading="lazy">`
    : `<span aria-hidden="true">${visuals[product.categoryId] || "🍽️"}</span>`;
  const burgerComboDetails = hasIncludedFries(product) && burgerComboIncludesText()
    ? `<div class="product-includes">${burgerComboIncludesText()}</div>`
    : "";

  return `
    <article class="product-card">
      <div class="product-visual">${visual}</div>
      <div class="product-info">
        ${tags}
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        ${burgerComboDetails}
        <strong class="product-price">${money(product.price)}</strong>
      </div>

      <button
        class="add-button"
        data-product-id="${product.id}"
        ${!canPlaceOrders() ? "disabled" : ""}>
        <span aria-hidden="true">+</span><span>Agregar</span>
      </button>
    </article>
  `;
}

function getProductOptions(product) {
  const productOptions = product.options || [];
  const includedFriesOptions = hasIncludedFries(product)
    ? state.restaurant.burgerAndComboFriesOptions || []
    : [];

  return [...productOptions, ...includedFriesOptions];
}

function openProduct(product) {
  state.productBeingConfigured = product;
  state.productOptions = getProductOptions(product);
  state.selectedOptions = [];

  const hasOptions = state.productOptions.length;

  $("#product-modal").innerHTML = `
    <div class="modal-backdrop" data-close-modal></div>
    <div class="modal-content">
      <button class="modal-close" data-close-modal aria-label="Cerrar">×</button>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      ${hasIncludedFries(product) && burgerComboIncludesText()
        ? `<p class="product-includes">${burgerComboIncludesText()}</p>`
        : ""}
      <strong>${money(product.price)}</strong>

      ${
        hasOptions
          ? state.productOptions.map(option => `
              <fieldset>
                <legend>${option.name}</legend>
                ${option.choices.map(choice => `
                  <label>
                    <input
                      type="${option.multiple ? "checkbox" : "radio"}"
                      name="${option.id}"
                      value="${choice.id}"
                      data-option-id="${option.id}"
                      data-choice-id="${choice.id}">
                    ${choice.name}
                    ${choice.price ? `(+${money(choice.price)})` : ""}
                  </label>
                `).join("")}
              </fieldset>
            `).join("")
          : ""
      }

      <button class="primary-button" id="confirm-product">
        Agregar al pedido
      </button>
    </div>
  `;

  $("#product-modal").classList.remove("hidden");
  $("#product-modal").setAttribute("aria-hidden", "false");

  $("#product-modal").querySelectorAll("input").forEach(input => {
    input.addEventListener("change", updateSelectedOptions);
  });

  $("#confirm-product").addEventListener("click", confirmProduct);

  $("#product-modal").querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeProductModal);
  });
}

function updateSelectedOptions() {
  state.selectedOptions = [
    ...$("#product-modal").querySelectorAll("input:checked")
  ].map(input => {
    const option = state.productOptions.find(
      item => item.id === input.dataset.optionId
    );

    return option.choices.find(
      choice => choice.id === input.dataset.choiceId
    );
  });
}

function confirmProduct() {
  const product = state.productBeingConfigured;

  const extraPrice = state.selectedOptions.reduce(
    (sum, option) => sum + (option.price || 0),
    0
  );

  state.cart.push({
    lineId: crypto.randomUUID(),
    productId: product.id,
    name: product.name,
    quantity: 1,
    basePrice: product.price,
    unitPrice: product.price + extraPrice,
    options: [...state.selectedOptions]
  });

  closeProductModal();
  renderCartBar();
}

function closeProductModal() {
  $("#product-modal").classList.add("hidden");
  $("#product-modal").setAttribute("aria-hidden", "true");
  state.productBeingConfigured = null;
  state.productOptions = [];
  state.selectedOptions = [];
}

function cartItemsCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return state.cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
}

function renderCartBar() {
  const bar = $("#cart-bar");

  if (!state.cart.length) {
    bar.classList.add("hidden");
    return;
  }

  bar.classList.remove("hidden");
  bar.innerHTML = `
    <button id="open-cart">
      <span>${cartItemsCount()} ${cartItemsCount() === 1 ? "producto" : "productos"}</span>
      <strong>${money(cartTotal())}</strong>
      <span>Ver pedido →</span>
    </button>
  `;

  $("#open-cart").addEventListener("click", openCart);
}

function openCart() {
  renderCartDrawer();
  $("#cart-drawer").classList.remove("hidden");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
}

function renderCartDrawer() {
  $("#cart-drawer").innerHTML = `
    <div class="drawer-backdrop" data-close-cart></div>
    <aside class="drawer-content">
      <button class="modal-close" data-close-cart>×</button>

      <h2>Tu pedido</h2>

      <div class="cart-items">
        ${state.cart.map(item => `
          <article class="cart-item">
            <div>
              <strong>${item.name}</strong>
              ${
                item.options.length
                  ? `<small>${item.options.map(option => option.name).join(", ")}</small>`
                  : ""
              }
              <span>${money(item.unitPrice)} c/u</span>
            </div>

            <div class="quantity">
              <button data-decrease="${item.lineId}">−</button>
              <span>${item.quantity}</span>
              <button data-increase="${item.lineId}">+</button>
            </div>

            <button class="remove" data-remove="${item.lineId}">Eliminar</button>
          </article>
        `).join("")}
      </div>

      <div class="cart-total">
        <span>Total</span>
        <strong>${money(cartTotal())}</strong>
      </div>

      ${
        state.restaurant.orderSettings.delivery || state.restaurant.orderSettings.pickup
          ? `
            <fieldset>
              <legend>¿Cómo querés recibirlo?</legend>
              ${
                state.restaurant.orderSettings.pickup
                  ? `<label><input type="radio" name="orderType" value="pickup"> Retiro en el local</label>`
                  : ""
              }
              ${
                state.restaurant.orderSettings.delivery
                  ? `<label><input type="radio" name="orderType" value="delivery"> Delivery</label>`
                  : ""
              }
            </fieldset>
          `
          : ""
      }

      ${state.restaurant.paymentMethods?.length
        ? `
          <fieldset>
            <legend>¿Cómo vas a pagar?</legend>
            ${state.restaurant.paymentMethods.map(method => `
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="${method.id}"
                  ${state.paymentMethod === method.id ? "checked" : ""}>
                ${method.label}
              </label>
            `).join("")}
          </fieldset>
        `
        : ""}

      <div id="order-extra-fields"></div>
          <p id="order-feedback" class="order-feedback hidden" role="alert" aria-live="assertive" aria-atomic="true"></p>

      <button
        class="primary-button"
        id="send-whatsapp"
        ${canPlaceOrders() ? "" : "disabled"}>
        Enviar pedido por WhatsApp
      </button>
    </aside>
  `;

  $("#cart-drawer").querySelectorAll("[data-close-cart]").forEach(element => {
    element.addEventListener("click", closeCart);
  });

  $("#cart-drawer").querySelectorAll("[data-increase]").forEach(button => {
    button.addEventListener("click", () => changeQuantity(button.dataset.increase, 1));
  });

  $("#cart-drawer").querySelectorAll("[data-decrease]").forEach(button => {
    button.addEventListener("click", () => changeQuantity(button.dataset.decrease, -1));
  });

  $("#cart-drawer").querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => removeItem(button.dataset.remove));
  });

  $("#cart-drawer").querySelectorAll('input[name="orderType"]').forEach(input => {
    input.addEventListener("change", () => {
      state.orderType = input.value;
      clearOrderFeedback();
      renderOrderExtraFields();
    });
  });

  $("#cart-drawer").querySelectorAll('input[name="paymentMethod"]').forEach(input => {
    input.addEventListener("change", () => {
      state.paymentMethod = input.value;
      clearOrderFeedback();
    });
  });

  $("#send-whatsapp").addEventListener("click", sendOrderToWhatsApp);
}

function renderOrderExtraFields() {
  const container = $("#order-extra-fields");

  if (!container) return;

  if (state.orderType === "delivery") {
    container.innerHTML = `
      <label>
        Nombre
        <input id="customer-name" type="text" autocomplete="name" placeholder="Tu nombre">
      </label>

      <label>
        Teléfono de contacto
        <input id="customer-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09X XXX XXX" required>
      </label>

      <label>
        Dirección
        <input id="customer-address" type="text" autocomplete="street-address" placeholder="Calle y número">
      </label>

      <label>
        Observaciones
        <textarea id="customer-notes" placeholder="Ej: sin cebolla"></textarea>
      </label>
    `;
    bindOrderFieldFeedback();
    return;
  }

  if (state.orderType === "pickup") {
    container.innerHTML = `
      <label>
        Nombre
        <input id="customer-name" type="text" autocomplete="name" placeholder="Tu nombre">
      </label>

      <label>
        Teléfono de contacto
        <input id="customer-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09X XXX XXX" required>
      </label>

      <label>
        Observaciones
        <textarea id="customer-notes" placeholder="Opcional"></textarea>
      </label>
    `;
    bindOrderFieldFeedback();
    return;
  }

  container.innerHTML = `
    <p class="helper">Elegí cómo querés recibir el pedido para continuar.</p>
  `;
}

function bindOrderFieldFeedback() {
  $("#order-extra-fields").querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("input", clearOrderFeedback);
  });
}

function showOrderFeedback(message, targetSelector) {
  const feedback = $("#order-feedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove("hidden");

  const target = targetSelector ? $(targetSelector) : null;
  target?.setAttribute("aria-invalid", "true");
  target?.focus();
}

function clearOrderFeedback() {
  const feedback = $("#order-feedback");
  if (!feedback) return;

  feedback.textContent = "";
  feedback.classList.add("hidden");
  $("#cart-drawer").querySelectorAll('[aria-invalid="true"]').forEach(field => {
    field.removeAttribute("aria-invalid");
  });
}

function changeQuantity(lineId, amount) {
  const item = state.cart.find(item => item.lineId === lineId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter(item => item.lineId !== lineId);
  }

  renderCartBar();

  if (state.cart.length) {
    renderCartDrawer();
  } else {
    closeCart();
  }
}

function removeItem(lineId) {
  state.cart = state.cart.filter(item => item.lineId !== lineId);
  renderCartBar();

  if (state.cart.length) {
    renderCartDrawer();
  } else {
    closeCart();
  }
}

function closeCart() {
  $("#cart-drawer").classList.add("hidden");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
}

function sendOrderToWhatsApp() {
  if (!canPlaceOrders() || !state.cart.length) return;
  clearOrderFeedback();

  if (state.restaurant.orderSettings.delivery || state.restaurant.orderSettings.pickup) {
    if (!state.orderType) {
      showOrderFeedback("Elegí cómo querés recibir el pedido.", 'input[name="orderType"]');
      return;
    }
  }

  const name = $("#customer-name")?.value.trim() || "";
  const phone = $("#customer-phone")?.value.trim() || "";
  const address = $("#customer-address")?.value.trim() || "";
  const notes = $("#customer-notes")?.value.trim() || "";

  if (!name) {
    showOrderFeedback("Ingresá tu nombre para continuar.", "#customer-name");
    return;
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    showOrderFeedback("Revisá el teléfono. Ingresá entre 8 y 15 dígitos.", "#customer-phone");
    return;
  }

  if (state.orderType === "delivery" && !address) {
    showOrderFeedback("Ingresá la dirección para el delivery.", "#customer-address");
    return;
  }

  const paymentMethod = state.restaurant.paymentMethods?.find(
    method => method.id === state.paymentMethod
  );
  if (state.restaurant.paymentMethods?.length && !paymentMethod) {
    showOrderFeedback("Elegí un medio de pago para continuar.", 'input[name="paymentMethod"]');
    return;
  }

  const recipient = getOrderWhatsAppNumber();
  if (!recipient) {
    showOrderFeedback("No pudimos preparar el contacto del local. Probá más tarde.");
    return;
  }

  const productLines = state.cart.flatMap(item => {
    const lines = [
      `- ${item.quantity} x ${item.name} - ${money(item.unitPrice * item.quantity)}`
    ];

    if (item.options.length) {
      lines.push(`  Extras: ${item.options.map(option => option.name).join(", ")}`);
    }

    return lines;
  });

  const lines = [
    `*PEDIDO NUEVO - ${state.restaurant.name.toUpperCase()}*`,
    "------------------------------",
    "",
    "*PRODUCTOS*",
    ...productLines,
    "",
    `*TOTAL: ${money(cartTotal())}*`,
    "",
    "*DATOS DEL PEDIDO*",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    paymentMethod ? `Medio de pago: ${paymentMethod.label}` : "",
    state.orderType ? `Modalidad: ${state.orderType === "delivery" ? "Delivery" : "Retiro"}` : "",
    address ? `Dirección: ${address}` : "",
    notes ? `Observaciones: ${notes}` : ""
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${recipient}?text=${message}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function bindGlobalEvents() {
  // Punto de extensión para futuras funcionalidades globales:
  // reviews, Instagram, promociones, programación de pedidos, etc.
}

init();
