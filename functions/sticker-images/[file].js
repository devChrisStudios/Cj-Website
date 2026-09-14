const MIME_TYPES = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
};

export async function onRequest(context) {
    const key = 'sticker-images/' + context.params.file;

    try {
        const obj = await context.env.DECAL_UPLOADS.get(key);
        if (!obj) {
            return new Response('Not found', { status: 404 });
        }

        const ext = key.split('.').pop().toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        return new Response(obj.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (err) {
        return new Response(err.message, { status: 500 });
    }
}