const urlRegex = new RegExp("https?://[^/]+/(https?://.+\\.)");
const defaultResponse = `~ serverless webproxy ~
source code: https://github.com/y21/serverless-webproxy

simply prepend worker domain and send request`;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
    console.log(request)
    try {
        if (!urlRegex.test(request.url)) {
            return new Response(defaultResponse, {
                headers: {
                    "content-type": "text/plain"
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