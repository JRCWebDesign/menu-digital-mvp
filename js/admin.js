import { DEMO_USER, DEMO_PASSWORD, SESSION_KEY, STORAGE_KEY, loadData, saveData, resetData, escapeHtml as e, safeImage } from './demo-store.js';
const root = document.querySelector('#admin-root');
let data, selectedId, imageValue = '', imageLoading = false, timer;
const drafts = new Map();
let lastEditedId;
const draftKey = () => selectedId || 'new';
const currency = n => new Intl.NumberFormat('es-UY', {style:'currency',currency:'UYU',maximumFractionDigits:0}).format(n);
function notice(message, error = false) {
  const box = document.querySelector('#feedback');
  box.textContent = message; box.classList.toggle('error',error); box.hidden = false;
  clearTimeout(timer); timer = setTimeout(() => box.hidden = true, 6500);
}
function authenticated() { return sessionStorage.getItem(SESSION_KEY) === DEMO_USER; }
function login() {
  root.innerHTML = `<section class="login panel"><span class="badge">DEMO INTERACTIVA</span><h1>Tu Smash. Tu menú.</h1><p class="muted">Entrá para probar cómo gestionar los productos de LKB Smash.</p><form id="login"><label>Usuario<input type="email" name="email" autocomplete="username" required></label><label>Contraseña<input type="password" name="password" autocomplete="current-password" required></label><button class="button primary">Ingresar al panel</button></form><p class="credentials">Usuario: <strong>${DEMO_USER}</strong><br>Contraseña: <strong>${DEMO_PASSWORD}</strong></p><p class="notice">Acceso simulado para presentación. No es autenticación segura. Los cambios se guardan solo en este navegador.</p></section>`;
  root.querySelector('form').onsubmit = event => {
    event.preventDefault(); const values = new FormData(event.target);
    if (values.get('email') !== DEMO_USER || values.get('password') !== DEMO_PASSWORD) return notice('Usuario o contraseña incorrectos.',true);
    sessionStorage.setItem(SESSION_KEY, DEMO_USER); start();
  };
}
function start() {
  if (!authenticated()) return login();
  try { data = loadData(); dashboard(); }
  catch(error) {
    root.innerHTML = '<section class="panel"><h1>No se pudo abrir la demo</h1><p id="load-error"></p><button class="button" id="restore">Restaurar datos originales</button></section>';
    root.querySelector('#load-error').textContent = error.message;
    root.querySelector('#restore').onclick = restore;
  }
}
function restore() {
  if (!confirm('¿Restaurar los 9 productos originales? Se perderán las ediciones de esta demo en este navegador.')) return;
  try { data = resetData(); drafts.clear(); selectedId = undefined; dashboard(); notice('Demo restaurada.'); }
  catch { notice('El navegador no permite restaurar el almacenamiento.',true); }
}
function dashboard() {
  root.innerHTML = `<div class="intro"><div><span class="badge">TU LOCAL / DEMO INTERACTIVA</span><h1>Administrá tu menú.</h1><p class="muted">LKB Smash · Productos, ofertas y novedades en un solo lugar.</p></div><div class="actions"><button class="button" id="reset">Restaurar demo</button><button class="button" id="logout">Salir</button></div></div><p class="notice">Probá los cambios y miralos en el menú. Esta demo guarda tus ediciones solo en este navegador.</p><div class="stats"><div class="stat"><strong>${data.products.filter(p=>p.active!==false).length}</strong><span>Productos visibles</span></div><div class="stat"><strong>${data.products.filter(p=>p.offerEnabled && p.active!==false).length}</strong><span>Ofertas activas</span></div><div class="stat"><strong>${data.promotion.active ? '1':'0'}</strong><span>Promoción publicada</span></div></div><div class="layout"><section class="panel"><div class="list-head"><h2>Productos</h2><button class="button primary" id="new-product">+ Nuevo</button></div><div id="products"></div></section><section class="panel" id="editor"></section></div><section class="panel promo"><span class="badge">DESTACÁ UNA NOVEDAD</span><h2 style="margin-top:14px">Promoción del menú</h2><form id="promo-form"><div class="form-grid"><label>Título<input name="title" maxlength="80" value="${e(data.promotion.title)}"></label><label>Producto asociado<select name="productId">${data.products.filter(p=>p.active!==false).map(p=>`<option value="${e(p.id)}" ${p.id===data.promotion.productId?'selected':''}>${e(p.name)}</option>`).join('')}</select></label><label class="full">Mensaje<textarea name="text" maxlength="240">${e(data.promotion.text)}</textarea></label><label class="check full"><input type="checkbox" name="active" ${data.promotion.active?'checked':''}> Mostrar promoción en el menú</label></div><div class="form-actions"><button class="button primary">Guardar promoción</button></div></form></section>`;
  root.querySelector('#products').innerHTML = data.products.map(p=>`<article class="product-row">${p.image?`<img src="${e(safeImage(p.image))}" alt="">`:''}<div class="product-copy"><h3>${e(p.name)}</h3><small>${p.offerEnabled?`<del>${currency(p.price)}</del> `:''}${currency(p.offerEnabled?p.offerPrice:p.price)}</small><span class="pill ${p.active===false?'hidden-pill':''}">${p.active===false?'Oculto':p.offerEnabled?'En oferta':'Visible'}</span></div><button class="button" data-edit="${e(p.id)}">Editar</button></article>`).join('');
  root.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>switchEditor(button.dataset.edit));
  root.querySelector('#new-product').onclick=()=>switchEditor(null);
  root.querySelector('#reset').onclick=restore;
  root.querySelector('#logout').onclick=()=>{sessionStorage.removeItem(SESSION_KEY);login();};
  root.querySelector('#promo-form').onsubmit=event=>{
    event.preventDefault(); if(!authenticated())return login();
    const values=new FormData(event.target), next=structuredClone(data);
    next.promotion={title:values.get('title').trim(),text:values.get('text').trim(),productId:values.get('productId'),active:values.has('active')};
    try{saveData(next);data=next;dashboard();notice('Promoción guardada. Ya podés verla en el menú.');}catch(error){notice(error.message,true);}
  };
  if(selectedId===undefined)selectedId=data.products[0]?.id;
  editor();
}
function editor() {
  const product=data.products.find(p=>p.id===selectedId);
  const p=drafts.get(draftKey())||product||{name:'',description:'',categoryId:data.categories[0].id,price:'',offerPrice:'',active:true};
  imageValue=p.image||'';imageLoading=false;
  root.querySelector('#editor').innerHTML=`<div class="editor-modes" aria-label="Modo del formulario"><button type="button" id="mode-edit" class="mode-button ${product?'active':''}" aria-pressed="${Boolean(product)}">Editar producto</button><button type="button" id="mode-new" class="mode-button ${!product?'active':''}" aria-pressed="${!product}">+ Nuevo producto</button></div><div class="editor-heading"><span class="badge">${product?'AJUSTÁ TU MENÚ':'SUMÁ UN FAVORITO'}</span><h2 id="editor-title">${product?e(product.name):'¿Qué sumamos al menú?'}</h2><p class="muted">${product?'Modificá los detalles y guardá los cambios.':'Completá los detalles para crear tu producto.'}</p><span id="draft-status" role="status">${drafts.has(draftKey())?'Borrador sin guardar':'Todo listo para editar'}</span></div><form id="product-form"><div class="form-grid"><label class="full">Nombre<input name="name" required maxlength="80" value="${e(p.name)}"></label><label class="full">Descripción<textarea name="description" maxlength="400">${e(p.description)}</textarea></label><label>Categoría<select name="categoryId">${data.categories.map(c=>`<option value="${e(c.id)}" ${c.id===p.categoryId?'selected':''}>${e(c.name)}</option>`).join('')}</select></label><label>Precio habitual ($)<input name="price" type="number" min="1" step="1" required value="${p.price}"></label><div class="offer-box full"><label class="check"><input name="offerEnabled" type="checkbox" ${p.offerEnabled?'checked':''}> Activar precio de oferta</label><label>Precio de oferta ($)<input name="offerPrice" type="number" min="1" step="1" value="${p.offerPrice??''}" ${p.offerEnabled?'required':'disabled'}></label></div><label class="full">Imagen · JPG, PNG o WebP, hasta 700 KB<input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp"></label><div class="full"><img id="image-preview" class="preview" alt="Vista previa del producto" ${imageValue?`src="${e(imageValue)}"`:'hidden'}><button type="button" class="button" id="remove-image" style="margin-top:10px">Quitar imagen</button></div><label class="check full"><input name="active" type="checkbox" ${p.active!==false?'checked':''}> Visible en el menú</label></div><div class="form-actions"><button id="save-product" class="button primary">${product?'Guardar cambios':'Crear producto'}</button><button type="button" class="button" id="cancel-edit">Cancelar</button></div></form>`;
  const form=root.querySelector('#product-form');
  if (product) lastEditedId = product.id;
  root.querySelectorAll('[data-edit]').forEach(button => {
    const active = button.dataset.edit === selectedId;
    button.closest('.product-row').classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'Editando' : 'Editar';
  });
  root.querySelector('#new-product').classList.toggle('is-active', !product);
  root.querySelector('#mode-new').onclick = () => switchEditor(null);
  root.querySelector('#mode-edit').onclick = () => switchEditor(lastEditedId || data.products[0]?.id || null);
  root.querySelector('#mode-edit').disabled = !data.products.length;
  root.querySelector('#cancel-edit').onclick = () => {
    drafts.delete(draftKey());
    if (!product) selectedId = lastEditedId || data.products[0]?.id;
    editor(); notice('Edición cancelada.');
  };
  form.addEventListener('input', rememberDraft);
  form.addEventListener('change', rememberDraft);
  const panel = root.querySelector('#editor');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'ease-out'});
  form.elements.offerEnabled.onchange=()=>{form.elements.offerPrice.disabled=!form.elements.offerEnabled.checked;form.elements.offerPrice.required=form.elements.offerEnabled.checked;};
  const preview=root.querySelector('#image-preview');
  root.querySelector('#remove-image').onclick=()=>{imageValue='';preview.removeAttribute('src');preview.hidden=true;root.querySelector('#image-upload').value='';rememberDraft();};
  root.querySelector('#image-upload').onchange=async event=>{
    const file=event.target.files[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>700*1024){event.target.value='';return notice('Elegí una imagen JPG, PNG o WebP de hasta 700 KB.',true);}
    imageLoading=true;form.querySelector('#save-product').disabled=true;
    try {
      const result=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
      await new Promise((resolve,reject)=>{const check=new Image();check.onload=resolve;check.onerror=reject;check.src=result;});
      if(!form.isConnected)return;
      imageValue=result;preview.src=result;preview.hidden=false;rememberDraft();
    }catch{notice('No se pudo leer esa imagen.',true);}finally{imageLoading=false;form.querySelector('#save-product').disabled=false;}
  };
  form.onsubmit=event=>{
    event.preventDefault();if(!authenticated())return login();if(imageLoading)return;
    const values=new FormData(form),next=structuredClone(data);
    const updated={...(product||{id:crypto.randomUUID(),tags:[]}),name:values.get('name').trim(),description:values.get('description').trim(),categoryId:values.get('categoryId'),price:Number(values.get('price')),offerEnabled:values.has('offerEnabled'),offerPrice:values.has('offerEnabled')?Number(values.get('offerPrice')):null,active:values.has('active'),image:imageValue};
    const index=next.products.findIndex(item=>item.id===updated.id);
    if(index>=0)next.products[index]=updated;else next.products.push(updated);
    if(!updated.active&&next.promotion.productId===updated.id)next.promotion.active=false;
    try{saveData(next);drafts.delete(draftKey());data=next;selectedId=updated.id;dashboard();notice('Producto guardado. El menú ya usa estos datos.');}catch(error){notice(error.message,true);}
  };
}
function rememberDraft() {
  const form = root.querySelector('#product-form');
  if (!form) return;
  const values = new FormData(form);
  drafts.set(draftKey(), {
    ...(data.products.find(p => p.id === selectedId) || {}),
    name: values.get('name'), description: values.get('description'), categoryId: values.get('categoryId'),
    price: values.get('price'), offerPrice: values.get('offerPrice'),
    offerEnabled: values.has('offerEnabled'), active: values.has('active'), image: imageValue
  });
  root.querySelector('#draft-status').textContent = 'Borrador sin guardar';
}
function switchEditor(id) {
  if (id === selectedId) return;
  selectedId = id; editor();
  const panel = root.querySelector('#editor');
  panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  panel.querySelector('[name=name]').focus({preventScroll:true});
}
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY)notice('El catálogo cambió en otra pestaña. Recargá antes de editar.',true);});
start();
