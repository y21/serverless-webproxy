const urlRegex = new RegExp("https?://[^/]+/(https?://.+\\.)");

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
    console.log(request)
    try {
        if (!urlRegex.test(request.url)) {
            return new Response(JSON.stringify({
                message: "No valid URL specified. "
            }), {
                status: 400,
                headers: {
                    "content-type": "application/json"
                }
            })
        } else {
            const [, url] = request.url.match(urlRegex),
                headers = {};
            for (const [k, v] of request.headers.entries()) {
                headers[k] = v;
            }
            const req = await fetch(url, {
                headers,
                method: request.method,
                body: request.bodyUsed ? request.body : undefined
            });

            return new Response(await req.text(), {
                status: req.status,
                headers: {
                    "content-type": req.headers.get("content-type")
                }
            });
        }
    } catch (e) {
        return new Response(e.stack, {
            status: 500,
            headers: {
                "content-type": "application/json"
            }
        })
    }
}