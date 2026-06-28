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
    '.form-group label{display:block;font-size:0.8rem;color:#eee;margin-bottom:0.3rem}' +
    '.form-group .help-text{font-size:0.75rem;color:#666;margin-top:0.25rem;line-height:1.4}' +
    '.form-group input,.form-group select,.form-group textarea{width:100%;padding:0.6rem;background:#1e1e1e;border:1px solid #333;border-radius:4px;color:#eee;font-size:0.9rem;outline:none}' +
    '.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#d90429}' +
    '.form-group textarea{resize:vertical;min-height:60px}' +
    '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}' +
    '.form-actions{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.5rem}' +
    '.empty{text-align:center;padding:3rem;color:#888}' +
    '.type-fields{display:none}' +
    '.type-fields.active{display:block}' +
    '.type-desc{padding:0.75rem;background:#1e1e1e;border-left:3px solid #d90429;border-radius:4px;font-size:0.85rem;color:#aaa;margin-bottom:1rem}' +
    '.color-list{margin-top:0.5rem}' +
    '.color-tag{display:inline-block;padding:2px 8px;margin:2px;border-radius:3px;font-size:0.75rem;background:#333;cursor:pointer}' +
    '.color-tag:hover{background:#d90429}' +
    '.form-section-title{font-size:0.85rem;color:#d90429;margin:1.25rem 0 0.75rem;padding-bottom:0.4rem;border-bottom:1px solid #222}' +
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
    '<label>What type of product is this?</label>' +
    '<select name="type" id="product-type" required>' +
    '<option value="pack">📦 Pack — a bundle of stickers sold together</option>' +
    '<option value="decal">🎨 Decal — a single sticker with color choices</option>' +
    '<option value="custom-decal">✏️ Custom Decal — customer uploads their own design</option>' +
    '</select>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Internal ID (auto-filled from name)</label>' +
    '<input type="text" name="id" id="product-id" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, and hyphens only" placeholder="e.g. standard-pack">' +
    '<div class="help-text">A unique code used in the system. Use lowercase letters, numbers, and hyphens. Example: <strong>standard-pack</strong> or <strong>odi-standard</strong>. This is auto-generated from the name but you can change it.</div>' +
    '</div>' +
    '</div>' +

    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Product Name</label>' +
    '<input type="text" name="name" id="product-name" required placeholder="e.g. Standard Pack">' +
    '<div class="help-text">What your customers will see. Example: <strong>Standard Pack</strong>, <strong>ODI Plate Decal</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Price ($)</label>' +
    '<input type="number" name="price" id="product-price" step="0.01" min="0" required placeholder="e.g. 9.99">' +
    '<div class="help-text">How much this costs. Example: <strong>9.99</strong></div>' +
    '</div>' +
    '</div>' +

    '<div class="form-group">' +
    '<label>Short Description</label>' +
    '<textarea name="description" id="product-description" required placeholder="A quick summary shown on the shop page..."></textarea>' +
    '<div class="help-text">A 1-2 sentence description that appears on the product card. Example: <strong>Twelve high-quality white laminate stickers. Perfect for dark surfaces.</strong></div>' +
    '</div>' +

    // Pack-specific fields
    '<div class="type-fields" id="fields-pack">' +
    '<div class="type-desc">A <strong>Pack</strong> is a bundle of multiple stickers sold together — like the Standard Pack or White 12-Pack. Customers see a card with the image, description, features list, and an "Add to Cart" button.</div>' +
    '<div class="form-section-title">Pack Details</div>' +
    '<div class="form-group">' +
    '<label>Full Description (optional)</label>' +
    '<textarea name="longDescription" placeholder="A longer version of the description shown in more detail..."></textarea>' +
    '<div class="help-text">A longer description for the product detail section. If left blank, the short description is used instead.</div>' +
    '</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Label / Badge</label>' +
    '<input type="text" name="badge" placeholder="e.g. White Stickers, Mixed — 6 White + 6 Black">' +
    '<div class="help-text">A short tag shown on the product card. Example: <strong>White Stickers</strong> or <strong>Mixed — 6 White + 6 Black</strong>.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Style</label>' +
    '<select name="badgeClass"><option value="color-badge-white">Light text on dark</option><option value="color-badge-black">Dark text on light</option></select>' +
    '<div class="help-text">Whether the badge label is <strong>light text on dark background</strong> (for light-colored badges) or <strong>dark text on light background</strong> (for dark-colored badges like "Black Stickers").</div>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Bullet Points (one per line)</label>' +
    '<textarea name="features" placeholder="12x White laminate stickers (various designs)&#10;Weather-resistant laminate&#10;Each sticker approx. 3&quot; × 3&quot;"></textarea>' +
    '<div class="help-text">List the key features as bullet points. Each line becomes a bullet in the product card.</div>' +
    '</div>' +
    '<div class="form-section-title">Image</div>' +
    '<div class="form-group">' +
    '<label>Product Image</label>' +
    '<input type="file" name="image_file" accept="image/png,image/jpeg,image.webp">' +
    '<div class="help-text">Upload a photo of the product. PNG, JPEG, or WebP files under 10MB.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or use an existing image path</label>' +
    '<input type="text" name="image" placeholder="images/Mixed_Pack.png">' +
    '<div class="help-text">If the image is already uploaded to the site, type its path here instead. Example: <strong>images/Mixed_Pack.png</strong> (leave the upload field above empty if using this).</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="featured" value="true"> Show on the home page</label>' +
    '<div class="help-text" style="margin-left:1.3rem">Check this to feature this product on the home page's "Featured Packs" section.</div>' +
    '</div>' +
    '</div>' +

    // Decal-specific fields
    '<div class="type-fields" id="fields-decal">' +
    '<div class="type-desc">A <strong>Decal</strong> is a single sticker sold in multiple color options. Customers pick a color and can add their Instagram handle. Like the ODI or Motocutz plate decals.</div>' +
    '<div class="form-section-title">Images &amp; Colors</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Base Image (the White version)</label>' +
    '<input type="file" name="base_image_file" accept="image/png,image/jpeg,image.webp">' +
    '<div class="help-text">Upload the white version of your decal. This is the default image shown.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or use an existing image path</label>' +
    '<input type="text" name="baseImage" placeholder="images/ODI_White.png">' +
    '<div class="help-text">If the base image is already uploaded, type its path. Example: <strong>images/ODI_White.png</strong></div>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Image Filename Prefix</label>' +
    '<input type="text" name="imagePrefix" id="image-prefix" placeholder="e.g. ODI" style="text-transform:capitalize">' +
    '<div class="help-text">Your color images should be named like <strong>{Prefix}_{Color}.png</strong> in the <code>images/</code> folder. For example, if the prefix is <strong>ODI</strong>, you need: <code>ODI_White.png</code>, <code>ODI_Blue.png</code>, <code>ODI_Red.png</code>, etc. This is auto-filled from the product name.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Available Colors</label>' +
    '<input type="text" name="colors" id="decal-colors" placeholder="White, Blue, Red, Green, Purple, Orange, Yellow, Pink">' +
    '<div class="help-text">List the color names separated by commas. These will show as clickable color circles on the product card. Each color needs an image file named <strong>{Prefix}_{Color}.png</strong>. Standard options: <strong>White, Blue, Red, Green, Purple, Orange, Yellow, Pink</strong></div>' +
    '</div>' +
    '<div class="form-section-title">Instagram Handle</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="hasHandle" value="true" checked> Let customers type their Instagram handle</label>' +
    '<div class="help-text" style="margin-left:1.3rem">If checked, a text field for the customer\'s Instagram @handle will appear on the product card. The handle gets printed on the decal.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Default Handle Text</label>' +
    '<input type="text" name="handleDefault" placeholder="@cjbik">' +
    '<div class="help-text">The placeholder text shown in the handle input field. Example: <strong>@cjbik</strong></div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // Custom decal fields
    '<div class="type-fields" id="fields-custom-decal">' +
    '<div class="type-desc">A <strong>Custom Decal</strong> lets customers design their own decal on an external site (like Motocutz), then upload their artwork here. You print and ship their custom design.</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Label / Badge Text</label>' +
    '<input type="text" name="badge" placeholder="e.g. ODI, Motocutz">' +
    '<div class="help-text">A short label shown on the product card. Example: <strong>ODI</strong> or <strong>Motocutz</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Style</label>' +
    '<select name="badgeClass"><option value="color-badge-white">Light text on dark</option><option value="color-badge-black">Dark text on light</option></select>' +
    '<div class="help-text">The color scheme for the badge label.</div>' +
    '</div>' +
    '</div>' +
    '<div class="form-section-title">External Design Link</div>' +
    '<div class="form-group">' +
    '<label>Design Page URL</label>' +
    '<input type="url" name="designLink" placeholder="https://motocutzmx.com/products/custom...">' +
    '<div class="help-text">The full URL to the external site where customers design their decal. Example: <strong>https://motocutzmx.com/products/surron-number-plate-decal-custom</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Button Text for the Link</label>' +
    '<input type="text" name="designLinkText" placeholder="Design on Motocutz →">' +
    '<div class="help-text">The text shown on the button that takes customers to the external design page. Example: <strong>Design on Motocutz →</strong></div>' +
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

    // Auto-generate ID from name
    'document.getElementById("product-name").addEventListener("input", function() {' +
    '  var idField = document.getElementById("product-id");' +
    '  if (idField.readOnly) return;' +
    '  var slug = this.value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\\s+/g, "-").replace(/^-+|-+$/g, "");' +
    '  idField.value = slug;' +
    '  // Also auto-fill image prefix for decals from the name' +
    '  var prefixField = document.getElementById("image-prefix");' +
    '  if (prefixField) {' +
    '    var prefix = this.value.replace(/\\(.*?\\)/g, "").replace(/Decal|Plate|Pack|Sticker/gi, "").trim();' +
    '    prefix = prefix.replace(/\\s+/g, "_");' +
    '    // Capitalize first letter of each word' +
    '    prefix = prefix.replace(/(?:^|_)(.)/g, function(m, c) { return c.toUpperCase(); });' +
    '    prefixField.value = prefix;' +
    '  }' +
    '});' +

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
                var baseImageFile = formData.get('base_image_file');
                var uploadedBaseImagePath = null;
                if (baseImageFile && baseImageFile.size > 0) {
                    if (allowed.includes(baseImageFile.type) && baseImageFile.size <= 10 * 1024 * 1024) {
                        var ext2 = baseImageFile.name.split('.').pop();
                        var key2 = 'product-images/' + id + '-base-' + Date.now() + '.' + ext2;
                        await context.env.DECAL_UPLOADS.put(key2, await baseImageFile.arrayBuffer());
                        uploadedBaseImagePath = '/' + key2;
                    }
                }
                product.baseImage = uploadedBaseImagePath || formData.get('baseImage') || '';
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
