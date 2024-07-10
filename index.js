const ADMIN_PATH = "/";
const API_PATH = "/api";
const URL_KEY = "longUrl";
const URL_NAME = "shortCode";
const SHORT_URL_KEY = "shorturl";

const index = `<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/js/bootstrap.min.js"></script>
    <script async src="https://umami.aiayw.com/script.js" data-website-id="1b4b644e-8552-452e-8c58-f6efb03ba42b"></script>
    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔗</text></svg>">
    <title>简短分享 - 长网址缩短，文本分享，Html单页分享</title>
</head>
<style>
    .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .btn-secondary,
    .btn-secondary:hover,
    .btn-secondary:focus {
        color: #333;
        text-shadow: none;
    }

    body {
        text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
    }

    .cover-container {
        max-width: 42em;
    }

    .navbar-brand svg {
        width: 30px;
        height: 30px;
    }

    @media (max-width: 576px) {
        #input-container .form-control,
        #input-container .input-group-text {
            display: block;
            width: 100%;
            margin-bottom: 1rem;
            border-radius: 5px;
        }
        }

    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 60px;
    }

    .footer .container {
        width: 100%;
        height: 100%;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .black-toast .toast {
        background-color: black;
      }

    .text-muted {
        font-size: 14px;
        color: #555;
        margin-right: 20px;
    }
</style>

<body class="d-flex h-100 text-center text-white bg-dark">

    <div class="position-fixed top-0 end-0 p-3 black-toast" style="z-index: 5;">
        <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                已复制到剪贴板！
            </div>
        </div>
    </div>

    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="mb-auto">
            <nav class="navbar navbar-expand-md navbar-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <svg t="1682502812036" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="1958" width="64" height="64">
                            <path
                                d="M429.013333 640A32 32 0 0 1 384 594.986667l37.76-37.76-22.826667-22.613334-135.68 135.68 90.453334 90.453334 135.68-135.68-22.613334-22.613334zM534.613333 398.933333l22.613334 22.613334L594.986667 384A32 32 0 0 1 640 429.013333l-37.76 37.76 22.613333 22.613334 135.68-135.68-90.453333-90.453334z"
                                fill="#666666" p-id="1959"></path>
                            <path
                                d="M512 21.333333a490.666667 490.666667 0 1 0 490.666667 490.666667A490.666667 490.666667 0 0 0 512 21.333333z m316.8 354.986667l-181.12 181.12a32 32 0 0 1-45.226667 0L557.226667 512 512 557.226667l45.226667 45.226666a32 32 0 0 1 0 45.226667l-181.12 181.12a32 32 0 0 1-45.226667 0l-135.68-135.68a32 32 0 0 1 0-45.226667l181.12-181.12a32 32 0 0 1 45.226667 0L466.773333 512 512 466.773333l-45.226667-45.226666a32 32 0 0 1 0-45.226667l181.12-181.12a32 32 0 0 1 45.226667 0l135.68 135.68a32 32 0 0 1 0 45.226667z"
                                fill="#666666" p-id="1960"></path>
                        </svg>
                        简短分享
                    </a>
                </div>
            </nav>
        </header>

        <main class="px-3">
            <p id="result" class="lead" onclick="copyToClipboard()"></p>

            <br>
            <div id="input-container">
                <div id="link_div" class="input-group mb-3">
                    <select class="form-control" id="select">
                        <option value="link">Link</option>
                        <option value="text">Text</option>
                        <option value="html">HTML</option>
                    </select>
                    <select class="form-control" id="expiration">
                        <option value="-1">无限制</option>
                        <option value="burn_after_reading">阅后即焚</option>
                        <option value="1">1分钟</option>
                        <option value="10">10分钟</option>
                        <option value="60">1小时</option>
                        <option value="1440">1天</option>
                        <option value="10080">7天</option>
                        <option value="43200">1个月</option>
                    </select>
                    <input type="text" id="name" placeholder="自定义后缀" class="input-group-text">
                </div>
            </div>
            <div id="text_div">
                <textarea id="link" placeholder="输入链接/文本/HTML源代码" class="form-control" rows="10"></textarea><br>
            </div>
            <p class="lead">
                <a href="#" onclick="getlink()" class="btn btn-lg btn-secondary fw-bold border-white bg-white">生成</a>
            </p>
        </main>

    </div>
    
    <footer class="footer">
        <div class="container">
        <a href="https://www.cloudflare.com/" class="text-muted">基于Cloudflare-WorkerKV的</a>
        <a href="https://github.com/Aiayw/CloudflareWorkerKV-UrlShort" class="text-muted">开源项目，请自行部署体验</a>
        </div>
    </footer>

    <script>
        async function postData(url = '', data = {}) {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            return response.json();
        }

        function isValidUrl(string) {
            try {
            new URL(string);
            return true;
            } catch (_) {
            return false;
            }
        }
      
        function copyToClipboard() {
            const textToCopy = document.getElementById('result').innerText;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const toast = new bootstrap.Toast(document.getElementById('toast'));
                    toast.show();
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        }

        function getlink() {
            const link = document.getElementById("link").value;
            const expiration = document.getElementById("expiration").value;
            const name = document.getElementById("name").value;
            const type = document.getElementById("select").value;
            const url = location.href + API_PATH;
            const data = { "longUrl": link, "expiration": expiration, "type": type, "name": name };

            if (link.trim() === "") {
                alert("请输入内容！");
                return;
            }

            if (type === 'link' && !isValidUrl(link)) {
                alert("请输入有效的链接！");
                return;
            }

            postData(url, data).then((resp) => {
                if (resp.status === 0) {
                    document.getElementById("result").innerText = resp.shortUrl;
                } else {
                    alert(resp.msg);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    </script>
</body>
</html>`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent');

  // 定义需要重定向的爬虫 User-Agent 列表
  const redirectUserAgents = ['TelegramBot', 'Twitterbot', 'Discordbot', 'Slackbot'];

  // 检查 User-Agent 是否在需要重定向的列表中
  if (redirectUserAgents.some(ua => userAgent.includes(ua))) {
    return Response.redirect('https://t.me/MFJD666', 301);
  }

  // 继续处理其他请求
  return handleMainRequest(request);
}

// 处理其他请求的主要逻辑
async function handleMainRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === 'POST' && pathname === API_PATH) {
    const body = await request.json();
    const longUrl = body.longUrl;
    const expiration = body.expiration;
    const name = body.name;
    const type = body.type;

    const shortCode = generateShortCode();
    const shortUrl = `${url.origin}/${shortCode}`;

    // Store the longUrl and additional information in KV
    await URL_STORAGE.put(shortCode, JSON.stringify({ longUrl, expiration, type, name }));

    const response = { status: 0, shortUrl: shortUrl };
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (pathname.startsWith(`/${ADMIN_PATH}/`)) {
    // Handle admin path requests if needed
  }

  if (pathname === '/') {
    return new Response(index, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  // Handle redirect for short URLs
  const shortCode = pathname.slice(1);
  const value = await URL_STORAGE.get(shortCode);

  if (value) {
    const { longUrl } = JSON.parse(value);
    return Response.redirect(longUrl, 301);
  }

  return new Response('404 Not Found', { status: 404 });
}

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}