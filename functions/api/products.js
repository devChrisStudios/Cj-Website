const DEFAULT_CATALOG = {
    "products": [
        {
            "type": "pack",
            "id": "standard-pack",
            "name": "Standard Pack",
            "price": 8.99,
            "image": "images/Mixed_Pack.png",
            "description": "The best of both worlds — six white stickers and six black stickers in one 12-pack. Perfect for any surface, any style.",
            "longDescription": "The best of both worlds — six white stickers and six black stickers in one 12-pack. Covers light and dark surfaces. Weather-resistant and built to last.",
            "badge": "Mixed — 6 White + 6 Black",
            "badgeClass": "color-badge-white",
            "features": [
                "6x White laminate stickers (various designs)",
                "6x Black laminate stickers (various designs)",
                "Weather-resistant laminate",
                "Each sticker approx. 3\" × 3\""
            ],
            "featured": true
        },
        {
            "type": "pack",
            "id": "white-pack",
            "name": "White 12-Pack",
            "price": 9.99,
            "image": "images/White_Pack.png",
            "description": "Twelve high-quality white laminate stickers. Perfect for dark surfaces.",
            "longDescription": "Twelve high-quality white laminate stickers. These look amazing on dark surfaces — helmets, bike frames, laptops, toolboxes, you name it.",
            "badge": "White Stickers",
            "badgeClass": "color-badge-white",
            "features": [
                "12x White laminate stickers (various designs)",
                "Weather-resistant laminate",
                "Each sticker approx. 3\" × 3\""
            ],
            "featured": true
        },
        {
            "type": "pack",
            "id": "black-pack",
            "name": "Black 12-Pack",
            "price": 9.99,
            "image": "images/Black_Pack.png",
            "description": "Twelve premium black stickers with a matte finish. Sleek and stealthy.",
            "longDescription": "Twelve premium black laminate stickers with a matte finish. Sleek, stealthy, and perfect for light-colored surfaces. Same durable construction.",
            "badge": "Black Stickers",
            "badgeClass": "color-badge-black",
            "features": [
                "12x Black laminate stickers (various designs)",
                "Weather-resistant laminate",
                "Each sticker approx. 3\" × 3\""
            ],
            "featured": true
        },
        {
            "type": "decal",
            "id": "odi-standard",
            "name": "ODI Plate Decal",
            "price": 15.99,
            "baseImage": "images/ODI_White.png",
            "imagePrefix": "ODI",
            "description": "Premium laminate decal for your ODI plate. Pick your color below.",
            "colors": ["White", "Blue", "Orange", "Red", "Purple", "Yellow", "Pink", "Green"],
            "hasHandle": true,
            "handleDefault": "@cjbik"
        },
        {
            "type": "decal",
            "id": "motocutz-standard",
            "name": "Motocutz Plate Decal",
            "price": 15.99,
            "baseImage": "images/Motocutz_White.png",
            "imagePrefix": "Motocutz",
            "description": "Premium laminate decal for your motocross plate. Pick your color below.",
            "colors": ["White", "Blue", "Orange", "Red", "Purple", "Yellow", "Pink", "Green"],
            "hasHandle": true,
            "handleDefault": "@cjbik"
        },
        {
            "type": "custom-decal",
            "id": "custom-decal-odi",
            "name": "ODI Plate Decal",
            "price": 15.99,
            "badge": "ODI",
            "badgeClass": "color-badge-white",
            "description": "Design your ODI plate decal on Motocutz, then upload your artwork here.",
            "designLink": "https://motocutzmx.com/products/surron-number-plate-decal-custom",
            "designLinkText": "Design on Motocutz →",
            "hasUpload": true
        },
        {
            "type": "custom-decal",
            "id": "custom-decal-motocutz",
            "name": "Motocutz Plate Decal",
            "price": 15.99,
            "badge": "Motocutz",
            "badgeClass": "color-badge-white",
            "description": "Design your custom motocross plate decal on Motocutz, then upload your artwork here.",
            "designLink": "https://motocutzmx.com/products/custom-og-motocutz-number-plate-decal",
            "designLinkText": "Design on Motocutz →",
            "hasUpload": true
        }
    ]
};

export async function onRequest(context) {
    try {
        if (context.env.DECAL_UPLOADS) {
            const obj = await context.env.DECAL_UPLOADS.get('products/catalog.json');
            if (obj) {
                const text = await obj.text();
                return new Response(text, {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
        }
        return new Response(JSON.stringify(DEFAULT_CATALOG), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (err) {
        return new Response(JSON.stringify(DEFAULT_CATALOG), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
