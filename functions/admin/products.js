function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderPage(catalog, message) {
    var products = (catalog && catalog.products) || [];
    var rows = products.map(function(p, i) {
        var typeLabel = { pack: 'Pack', decal: 'Decal', 'custom-decal': 'Custom Decal' }[p.type] || p.type;
        var imgSrc = p.image || p.baseImage || '';
        var imgHtml = imgSrc ? '<img src="' + escapeHtml(imgSrc) + '" style="width:50px;height:50px;object-fit:contain;border-radius:4px;background:#1e1e1e;vertical-align:middle">' : '—';
        return '<tr>' +
            '<td>' + imgHtml + '</td>' +
            '<td>' + escapeHtml(p.id) + '</td>' +
            '<td>' + escapeHtml(p.name) + '</td>' +
            '<td><span class="type-badge type-' + p.type + '">' + typeLabel + '</span></td>' +
            '<td>$' + (p.price || 0).toFixed(2) + '</td>' +
            '<td>' +
            '<button class="btn-edit" data-index="' + i + '">Edit</button> ' +
            '<button class="btn-delete" data-index="' + i + '" style="background:#6b0000">Delete</button>' +
            '</td>' +
            '</tr>';
    }).join('');

    return '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Products — BIKFAM Admin</title>' +
    '<style>' +
    '*{box-sizing:border-box}' +
    'body{margin:0;background:#0a0a0a;color:#eee;font-family:system-ui,sans-serif}' +
    '.header{background:#151515;padding:1rem 2rem;display:flex;align-items:center;gap:2rem;border-bottom:1px solid #222}' +
    '.header h1{margin:0;font-size:1.25rem}' +
    '.header .red{color:#d90429}' +
    '.header a{color:#888;text-decoration:none;font-size:0.875rem}' +
    '.header a:hover{color:#d90429}' +
    '.header .nav-links{display:flex;gap:1rem}' +
    '.header .nav-links a.active{color:#d90429}' +
    '.content{padding:2rem}' +
    '.msg{background:rgba(217,4,41,0.15);border:1px solid #d90429;color:#d90429;padding:0.75rem 1rem;border-radius:4px;margin-bottom:1rem}' +
    'table{width:100%;border-collapse:collapse;margin-bottom:2rem}' +
    'th{text-align:left;padding:0.75rem 0.5rem;border-bottom:2px solid #333;color:#888;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em}' +
    'td{padding:0.75rem 0.5rem;border-bottom:1px solid #1e1e1e;vertical-align:middle}' +
    'tr:hover td{background:#111}' +
    '.type-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:0.75rem}' +
    '.type-pack{background:#1a3a1a;color:#4caf50}' +
    '.type-decal{background:#1a2a3a;color:#42a5f5}' +
    '.type-custom-decal{background:#3a1a2a;color:#ff7043}' +
    'button{padding:0.4rem 0.75rem;background:#d90429;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:0.8rem}' +
    'button:hover{background:#b00322}' +
    'button.btn-secondary{background:#333}' +
    'button.btn-secondary:hover{background:#555}' +
    '.add-btn{margin-bottom:1rem;padding:0.6rem 1.2rem;font-size:0.9rem}' +
    '.form-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:1000;align-items:center;justify-content:center}' +
    '.form-overlay.open{display:flex}' +
    '.form-box{background:#151515;border:1px solid #333;border-radius:8px;padding:2rem;width:100%;max-width:600px;max-height:90vh;overflow-y:auto}' +
    '.form-box h2{margin:0 0 1.5rem;font-size:1.3rem}' +
    '.form-group{margin-bottom:1rem}' +
    '.form-group label{display:block;font-size:0.8rem;color:#888;margin-bottom:0.3rem;text-transform:uppercase}' +
    '.form-group input,.form-group select,.form-group textarea{width:100%;padding:0.6rem;background:#1e1e1e;border:1px solid #333;border-radius:4px;color:#eee;font-size:0.9rem;outline:none}' +
    '.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#d90429}' +
    '.form-group textarea{resize:vertical;min-height:60px}' +
    '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}' +
    '.form-actions{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.5rem}' +
    '.empty{text-align:center;padding:3rem;color:#888}' +
    '.type-fields{display:none}' +
    '.type-fields.active{display:block}' +
    '.color-list{margin-top:0.5rem}' +
    '.color-tag{display:inline-block;padding:2px 8px;margin:2px;border-radius:3px;font-size:0.75rem;background:#333;cursor:pointer}' +
    '.color-tag:hover{background:#d90429}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="header">' +
    '<h1><span class="red">BIK</span>FAM Admin</h1>' +
    '<div class="nav-links">' +
    '<a href="/admin">Orders</a>' +
    '<a href="/admin/products" class="active">Products</a>' +
    '</div>' +
    '<a href="/admin/logout" style="margin-left:auto">Sign Out</a>' +
    '</div>' +
    '<div class="content">' +
    (message ? '<div class="msg">' + escapeHtml(message) + '</div>' : '') +
    '<button class="add-btn" id="add-btn">+ Add Product</button>' +
    (products.length === 0 ?
        '<div class="empty"><p>No products yet. Add your first product above.</p></div>' :
        '<table><thead><tr><th>Image</th><th>ID</th><th>Name</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table>') +
    '</div>' +

    // Product form overlay
    '<div class="form-overlay" id="form-overlay">' +
    '<div class="form-box">' +
    '<h2 id="form-title">Add Product</h2>' +
    '<form method="POST" action="/admin/products" id="product-form" enctype="multipart/form-data">' +
    '<input type="hidden" name="action" value="save">' +
    '<input type="hidden" name="edit_index" id="edit-index" value="">' +

    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Type</label>' +
    '<select name="type" id="product-type" required>' +
    '<option value="pack">Pack</option>' +
    '<option value="decal">Decal</option>' +
    '<option value="custom-decal">Custom Decal</option>' +
    '</select>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Product ID (unique, no spaces)</label>' +
    '<input type="text" name="id" id="product-id" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, and hyphens only">' +
    '</div>' +
    '</div>' +

    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Name</label>' +
    '<input type="text" name="name" id="product-name" required>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Price</label>' +
    '<input type="number" name="price" id="product-price" step="0.01" min="0" required>' +
    '</div>' +
    '</div>' +

    '<div class="form-group">' +
    '<label>Description (short)</label>' +
    '<textarea name="description" id="product-description" required></textarea>' +
    '</div>' +

    // Pack-specific fields
    '<div class="type-fields" id="fields-pack">' +
    '<div class="form-group">' +
    '<label>Long Description</label>' +
    '<textarea name="longDescription"></textarea>' +
    '</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Badge Text</label>' +
    '<input type="text" name="badge">' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Class</label>' +
    '<select name="badgeClass"><option value="color-badge-white">White</option><option value="color-badge-black">Black</option></select>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Features (one per line)</label>' +
    '<textarea name="features" placeholder="Feature 1&#10;Feature 2&#10;Feature 3"></textarea>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Image Path</label>' +
    '<input type="text" name="image" placeholder="images/MyPack.png">' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or upload new image</label>' +
    '<input type="file" name="image_file" accept="image/png,image/jpeg,image/webp">' +
    '</div>' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="featured" value="true"> Show on home page</label>' +
    '</div>' +
    '</div>' +

    // Decal-specific fields
    '<div class="type-fields" id="fields-decal">' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Base Image Path</label>' +
    '<input type="text" name="baseImage" placeholder="images/ODI_White.png">' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Image Prefix (for color swap)</label>' +
    '<input type="text" name="imagePrefix" placeholder="ODI">' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Colors (comma-separated)</label>' +
    '<input type="text" name="colors" placeholder="White, Blue, Red, Green">' +
    '</div>' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="hasHandle" value="true" checked> Show @handle input</label>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Default Handle</label>' +
    '<input type="text" name="handleDefault" placeholder="@cjbik">' +
    '</div>' +
    '</div>' +

    // Custom decal fields
    '<div class="type-fields" id="fields-custom-decal">' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Badge Text</label>' +
    '<input type="text" name="badge" placeholder="ODI">' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Class</label>' +
    '<select name="badgeClass"><option value="color-badge-white">White</option><option value="color-badge-black">Black</option></select>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Design Link URL</label>' +
    '<input type="url" name="designLink" placeholder="https://motocutzmx.com/...">' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Design Link Text</label>' +
    '<input type="text" name="designLinkText" placeholder="Design on Motocutz →">' +
    '</div>' +
    '</div>' +

    '<div class="form-actions">' +
    '<button type="button" class="btn-secondary" id="form-cancel">Cancel</button>' +
    '<button type="submit">Save Product</button>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>' +

    '<script>' +
    'var products = ' + JSON.stringify(products) + ';' +

    // Type switching
    'var typeSelect = document.getElementById("product-type");' +
    'function showFields() {' +
    '  document.querySelectorAll(".type-fields").forEach(function(el) { el.classList.remove("active"); });' +
    '  var f = document.getElementById("fields-" + typeSelect.value);' +
    '  if (f) f.classList.add("active");' +
    '}' +
    'typeSelect.addEventListener("change", showFields);' +
    'showFields();' +

    // Form overlay
    'var overlay = document.getElementById("form-overlay");' +
    'document.getElementById("add-btn").addEventListener("click", function() {' +
    '  document.getElementById("form-title").textContent = "Add Product";' +
    '  document.getElementById("edit-index").value = "";' +
    '  document.getElementById("product-form").reset();' +
    '  overlay.classList.add("open");' +
    '  showFields();' +
    '});' +
    'document.getElementById("form-cancel").addEventListener("click", function() { overlay.classList.remove("open"); document.getElementById("product-id").readOnly = false; });' +

    // Edit buttons
    'document.querySelectorAll(".btn-edit").forEach(function(btn) {' +
    '  btn.addEventListener("click", function() {' +
    '    var idx = parseInt(this.dataset.index);' +
    '    var p = products[idx];' +
    '    document.getElementById("form-title").textContent = "Edit Product";' +
    '    document.getElementById("edit-index").value = idx;' +
    '    document.getElementById("product-type").value = p.type;' +
    '    document.getElementById("product-id").value = p.id;' +
    '    document.getElementById("product-name").value = p.name;' +
    '    document.getElementById("product-price").value = p.price;' +
    '    document.getElementById("product-description").value = p.description || "";' +
    '    document.getElementById("product-id").readOnly = true;' +
    '    showFields();' +

    // Pack fields
    '    if (p.type === "pack") {' +
    '      document.querySelector("[name=longDescription]").value = p.longDescription || "";' +
    '      document.querySelector("[name=badge]").value = p.badge || "";' +
    '      document.querySelector("[name=badgeClass]").value = p.badgeClass || "color-badge-white";' +
    '      document.querySelector("[name=features]").value = (p.features || []).join("\\n");' +
    '      document.querySelector("[name=image]").value = p.image || "";' +
    '      document.querySelector("[name=featured]").checked = p.featured === true;' +
    '    }' +

    // Decal fields
    '    if (p.type === "decal") {' +
    '      document.querySelector("[name=baseImage]").value = p.baseImage || "";' +
    '      document.querySelector("[name=imagePrefix]").value = p.imagePrefix || "";' +
    '      document.querySelector("[name=colors]").value = (p.colors || []).join(", ");' +
    '      document.querySelector("[name=hasHandle]").checked = p.hasHandle !== false;' +
    '      document.querySelector("[name=handleDefault]").value = p.handleDefault || "";' +
    '    }' +

    // Custom decal fields
    '    if (p.type === "custom-decal") {' +
    '      document.querySelector("[name=badge]").value = p.badge || "";' +
    '      document.querySelector("[name=badgeClass]").value = p.badgeClass || "color-badge-white";' +
    '      document.querySelector("[name=designLink]").value = p.designLink || "";' +
    '      document.querySelector("[name=designLinkText]").value = p.designLinkText || "";' +
    '    }' +

    '    overlay.classList.add("open");' +
    '  });' +
    '});' +

    // Delete buttons
    'document.querySelectorAll(".btn-delete").forEach(function(btn) {' +
    '  btn.addEventListener("click", function() {' +
    '    if (!confirm("Delete this product?")) return;' +
    '    var idx = parseInt(this.dataset.index);' +
    '    var form = document.createElement("form");' +
    '    form.method = "POST";' +
    '    form.action = "/admin/products";' +
    '    var inp = document.createElement("input");' +
    '    inp.type = "hidden";' +
    '    inp.name = "action";' +
    '    inp.value = "delete";' +
    '    form.appendChild(inp);' +
    '    var inp2 = document.createElement("input");' +
    '    inp2.type = "hidden";' +
    '    inp2.name = "delete_index";' +
    '    inp2.value = idx;' +
    '    form.appendChild(inp2);' +
    '    document.body.appendChild(form);' +
    '    form.submit();' +
    '  });' +
    '});' +

    // Re-enable ID field when form closes
    'overlay.addEventListener("click", function(e) { if (e.target === overlay) { overlay.classList.remove("open"); document.getElementById("product-id").readOnly = false; } });' +
    '</script>' +

    '</body>' +
    '</html>';
}

export async function onRequest(context) {
    var catalog = { products: [] };
    try {
        var obj = await context.env.DECAL_UPLOADS.get('products/catalog.json');
        if (obj) {
            catalog = JSON.parse(await obj.text());
        }
    } catch (e) {}

    var url = new URL(context.request.url);

    if (context.request.method === 'POST') {
        var formData = await context.request.formData();
        var action = formData.get('action');

        if (action === 'delete') {
            var idx = parseInt(formData.get('delete_index'));
            if (!isNaN(idx) && idx >= 0 && idx < catalog.products.length) {
                catalog.products.splice(idx, 1);
                await context.env.DECAL_UPLOADS.put('products/catalog.json', JSON.stringify(catalog));
                return new Response(renderPage(catalog, 'Product deleted.'), {
                    headers: { 'Content-Type': 'text/html' }
                });
            }
        }

        if (action === 'save') {
            var type = formData.get('type');
            var id = formData.get('id');
            var name = formData.get('name');
            var price = parseFloat(formData.get('price')) || 0;
            var description = formData.get('description') || '';
            var editIndex = formData.get('edit_index');

            var product = { type: type, id: id, name: name, price: price, description: description };

            // Handle image upload
            var imageFile = formData.get('image_file');
            var uploadedImagePath = null;
            if (imageFile && imageFile.size > 0) {
                var allowed = ['image/png', 'image/jpeg', 'image/webp'];
                if (allowed.includes(imageFile.type) && imageFile.size <= 10 * 1024 * 1024) {
                    var ext = imageFile.name.split('.').pop();
                    var key = 'product-images/' + id + '-' + Date.now() + '.' + ext;
                    await context.env.DECAL_UPLOADS.put(key, await imageFile.arrayBuffer());
                    uploadedImagePath = '/' + key;
                }
            }

            if (type === 'pack') {
                product.image = uploadedImagePath || formData.get('image') || '';
                product.longDescription = formData.get('longDescription') || '';
                product.badge = formData.get('badge') || '';
                product.badgeClass = formData.get('badgeClass') || 'color-badge-white';
                var featuresRaw = formData.get('features') || '';
                product.features = featuresRaw.split('\n').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
                product.featured = formData.get('featured') === 'true';
            } else if (type === 'decal') {
                product.baseImage = uploadedImagePath || formData.get('baseImage') || '';
                product.imagePrefix = formData.get('imagePrefix') || '';
                var colorsRaw = formData.get('colors') || '';
                product.colors = colorsRaw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
                product.hasHandle = formData.get('hasHandle') === 'true';
                product.handleDefault = formData.get('handleDefault') || '@cjbik';
            } else if (type === 'custom-decal') {
                product.badge = formData.get('badge') || '';
                product.badgeClass = formData.get('badgeClass') || 'color-badge-white';
                product.designLink = formData.get('designLink') || '';
                product.designLinkText = formData.get('designLinkText') || 'Design on Motocutz →';
                product.hasUpload = true;
            }

            if (editIndex !== null && editIndex !== '') {
                var idx = parseInt(editIndex);
                if (!isNaN(idx) && idx >= 0 && idx < catalog.products.length) {
                    catalog.products[idx] = product;
                }
            } else {
                catalog.products.push(product);
            }

            await context.env.DECAL_UPLOADS.put('products/catalog.json', JSON.stringify(catalog));
            return new Response(renderPage(catalog, 'Product saved.'), {
                headers: { 'Content-Type': 'text/html' }
            });
        }
    }

    return new Response(renderPage(catalog, null), {
        headers: { 'Content-Type': 'text/html' }
    });
}
