// 管理员页面路径 （默认为 / 如果隐藏首页可设置为其他路径，例如：/admin ）
const ADMIN_PATH = "/666";
// API 路径
const API_PATH = "/api";
// 长链接键名
const URL_KEY = "longUrl";
// 短链接键名
const URL_NAME = "shortCode";
// 短链接键名（用于 API 返回）
const SHORT_URL_KEY = "shorturl";

// 添加爬虫 User-Agent 判断和重定向逻辑
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
  const { protocol, hostname, pathname } = new URL(request.url);

  // index.html
  if (pathname == ADMIN_PATH) {
    return new Response(index, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  
  // short api
  if (pathname.startsWith(API_PATH)) {
    const body = JSON.parse(await request.text());
    console.log(body);
    var short_type = "link";
    if (body["type"] != undefined && body["type"] != "") {
      short_type = body["type"];
    }
    if (
      body[URL_NAME] == undefined ||
      body[URL_NAME] == "" ||
      body[URL_NAME].length < 2
    ) {
      body[URL_NAME] = Math.random().toString(36).slice(-6);
    }
    
    // 检查自定义后缀是否已经存在
    if (await shortlink.get(body[URL_NAME])) {
      return new Response(
        JSON.stringify({ error: "该后缀已经被使用，请使用其他后缀。" }),
        {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }
    
    const expiration = parseInt(body["expiration"]);
    let expiresAt = null;
    await shortlink.put(
      body[URL_NAME],
      JSON.stringify({
        type: short_type,
        value: body[URL_KEY],
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
        burn_after_reading: body["burn_after_reading"], 
      })
    );
     // Remove other fields from the response body
    const responseBody = {
      type: body.type,
      shorturl: `${protocol}//${hostname}/${body[URL_NAME]}`,
      shortCode: body[URL_NAME],
    };
    
    // Add Access-Control-Allow-Origin header to the response
    return new Response(JSON.stringify(responseBody), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  
  const key = pathname.replace("/", "");
  if (key !== "" && !(await shortlink.get(key))) {
    return Response.redirect(`${protocol}//${hostname}${ADMIN_PATH}`, 302);
  }
  if (key == "") {
    const html = await fetch(STATICHTML);
    return new Response(await html.text(), {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }
  let link = await shortlink.get(key);
  if (link != null) {
    link = JSON.parse(link);
    console.log(link);
    const expiresAt = link["expiresAt"] ? new Date(link["expiresAt"]) : null;
    const now = new Date();
    if (expiresAt && now >= expiresAt) {
      return new Response(`链接已过期`, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    // 删除阅后即焚的链接
    if (link["burn_after_reading"]) {
      await shortlink.delete(key);
    }
    // redirect
    if (link["type"] == "link") {
      return Response.redirect(link["value"], 302);
    }
    if (link["type"] == "html") {
      return new Response(link["value"], {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    } else {
      // textarea
      return new Response(`${link["value"]}`, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  }
  return new Response(`403`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

// 你的 HTML 内容
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
                                d="M429.013333 640A32 32 0 0 1 384 594.986667l37.76-37.76-22.826667-22.613334-135.68 135.68 90.453334 90.453334 135.68-135.68-22.613334-22.613334zM534.613333 398.933333l22.613334 22.613334L594.986667 384A32 32 0 0 1 640 429.013333l-37.76 37.76 22.613333 22.613334 135.68-135.68-90.453333-90.453334-135.68 135.68z"
                                fill="#ffffff" p-id="1959"></path>
                            <path
                                d="M512 960c-247.466667 0-448-200.533333-448-448s200.533333-448 448-448 448 200.533333 448 448-200.533333 448-448 448z m0-64c212.053333 0 384-171.946667 384-384S724.053333 128 512 128 128 299.946667 128 512s171.946667 384 384 384z"
                                fill="#ffffff" p-id="1960"></path>
                        </svg>
                        <span>简短分享</span>
                    </a>
                </div>
            </nav>
        </header>
        <main class="px-3">
            <div id="input-container" class="input-group mb-3">
                <input type="text" id="input-text" class="form-control form-control-lg"
                    placeholder="请输入长网址，文本或 Html 片段" aria-label="长网址，文本或 Html 片段"
                    aria-describedby="button-addon2">
                <span class="input-group-text" id="input-type">链接</span>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="input-suffix">自定义后缀</span>
                <input type="text" id="suffix-text" class="form-control form-control-lg" placeholder="可选"
                    aria-label="可选" aria-describedby="suffix-text">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="input-expiration">有效期</span>
                <select id="expiration-select" class="form-select form-select-lg">
                    <option value="">永久</option>
                    <option value="3600">1小时</option>
                    <option value="86400">1天</option>
                    <option value="604800">7天</option>
                    <option value="2592000">30天</option>
                </select>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="input-burn-after-reading">阅后即焚</span>
                <input type="checkbox" id="burn-after-reading-checkbox" class="form-check-input form-check-lg"
                    style="margin-left: 10px; margin-top: 12px;">
            </div>
            <div class="btn-group mb-3" role="group" aria-label="选择类型">
                <button type="button" class="btn btn-secondary" id="link-button">链接</button>
                <button type="button" class="btn btn-secondary" id="text-button">文本</button>
                <button type="button" class="btn btn-secondary" id="html-button">HTML</button>
            </div>
            <button type="button" id="submit-btn" class="btn btn-lg btn-primary w-100">生成短链接</button>
            <br />
            <br />
            <div id="result-container" class="input-group mb-3" style="display:none;">
                <span class="input-group-text" id="shorturl-label">短链接</span>
                <input type="text" id="shorturl-text" class="form-control form-control-lg" readonly
                    aria-label="短链接" aria-describedby="shorturl-label">
                <button class="btn btn-secondary btn-lg" id="copy-btn" type="button">复制</button>
            </div>
        </main>
        <footer class="footer mt-auto py-3">
            <div class="container">
                <span class="text-muted">版权所有 &copy; 2023</span>
            </div>
        </footer>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const submitBtn = document.getElementById("submit-btn");
            const shortUrlInput = document.getElementById("shorturl-text");
            const resultContainer = document.getElementById("result-container");
            const copyBtn = document.getElementById("copy-btn");
            const inputTypeBtn = document.getElementById("input-type");
            const linkButton = document.getElementById("link-button");
            const textButton = document.getElementById("text-button");
            const htmlButton = document.getElementById("html-button");
            const toastEl = document.getElementById("toast");

            // 检测剪贴板 API 是否支持
            function isClipboardApiSupported() {
                return navigator.clipboard && typeof navigator.clipboard.writeText === "function";
            }

            function showToast() {
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
            }

            function copyToClipboard(text) {
                if (isClipboardApiSupported()) {
                    navigator.clipboard.writeText(text).then(showToast).catch(function (err) {
                        console.error("Failed to copy text to clipboard: ", err);
                    });
                } else {
                    console.warn("Clipboard API not supported. Falling back to legacy method.");
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    textarea.style.position = "fixed";
                    textarea.style.opacity = "0";
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    showToast();
                }
            }

            copyBtn.addEventListener("click", function () {
                copyToClipboard(shortUrlInput.value);
            });

            function toggleActive(button) {
                [linkButton, textButton, htmlButton].forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                inputTypeBtn.textContent = button.textContent;
            }

            linkButton.addEventListener("click", function () { toggleActive(linkButton); });
            textButton.addEventListener("click", function () { toggleActive(textButton); });
            htmlButton.addEventListener("click", function () { toggleActive(htmlButton); });

            submitBtn.addEventListener("click", async function () {
                const inputText = document.getElementById("input-text").value;
                const suffixText = document.getElementById("suffix-text").value;
                const expiration = document.getElementById("expiration-select").value;
                const burnAfterReading = document.getElementById("burn-after-reading-checkbox").checked;

                const requestData = {
                    longUrl: inputText,
                    type: inputTypeBtn.textContent.toLowerCase(),
                    shortCode: suffixText,
                    expiration: expiration,
                    burn_after_reading: burnAfterReading,
                };

                const response = await fetch("/api", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });

                const result = await response.json();
                if (response.ok) {
                    shortUrlInput.value = result.shorturl;
                    resultContainer.style.display = "block";
                } else {
                    alert(result.error);
                }
            });
        });
    </script>
</body>
</html>`;