// 全局变量：当前加载的章节
let currentChapter = 0;
// 章节列表（与侧边栏对应）
const chapterList = [
    { name: "前言", path: "novel/title.md" },
    { name: "完整目录", path: "novel/directory.md" },
    { name: "第1章", path: "novel/chapter/chapter-1.md" },
    { name: "第2章", path: "novel/chapter/chapter-2.md" },
    { name: "第3章", path: "novel/chapter/chapter-3.md" },
    { name: "第4章", path: "novel/chapter/chapter-4.md" },
    { name: "第5章", path: "novel/chapter/chapter-5.md" },
    { name: "第6章", path: "novel/chapter/chapter-6.md" },
    { name: "第7章", path: "novel/chapter/chapter-7.md" },
    { name: "第8章", path: "novel/chapter/chapter-8.md" },
    { name: "第9章", path: "novel/chapter/chapter-9.md" },
    { name: "第10章", path: "novel/chapter/chapter-10.md" },
    { name: "第11章", path: "novel/chapter/chapter-11.md" },
    { name: "第12章", path: "novel/chapter/chapter-12.md" },
    { name: "第13章", path: "novel/chapter/chapter-13.md" },
    { name: "第14章", path: "novel/chapter/chapter-14.md" },
    { name: "第15章", path: "novel/chapter/chapter-15.md" }
];

// 初始化：加载前言
window.onload = function () {
    loadMD("novel/title.md");
    // 监听滚动，显示/隐藏返回顶部按钮
    window.onscroll = function () {
        const backToTop = document.getElementById("back-to-top");
        if (document.documentElement.scrollTop > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    };
    // 绑定章节切换按钮事件
    document.getElementById("prev-chapter").addEventListener("click", loadPrevChapter);
    document.getElementById("next-chapter").addEventListener("click", loadNextChapter);
};

// 加载MD文件并渲染
function loadMD(filePath) {
    // 1. 更新当前章节索引
    currentChapter = chapterList.findIndex(item => item.path === filePath);

    // 2. 更新侧边栏激活状态
    const links = document.querySelectorAll(".sidebar a");
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `javascript:loadMD('${filePath}')`) {
            link.classList.add("active");
        }
    });

    // 3. 更新章节切换按钮状态
    document.getElementById("prev-chapter").disabled = currentChapter <= 0;
    document.getElementById("next-chapter").disabled = currentChapter >= chapterList.length - 1;

    // 4. 加载MD文件
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`无法加载文件: ${filePath}`);
            return response.text();
        })
        .then(markdown => {
            // 用marked渲染MD为HTML
            const html = marked.parse(markdown);
            document.getElementById("md-content").innerHTML = html;

            // ========== 核心修改：重写MD中的链接点击事件 ==========
            // 遍历所有MD渲染后的<a>标签
            const mdLinks = document.querySelectorAll("#md-content a");
            mdLinks.forEach(link => {
                // 获取链接的href属性（原MD中的路径）
                const linkHref = link.getAttribute("href");
                // 过滤掉外部链接（以http/https开头），只处理本地MD链接
                if (!linkHref.startsWith("http") && linkHref.endsWith(".md")) {
                    // 阻止默认跳转行为
                    link.addEventListener("click", function (e) {
                        e.preventDefault();
                        // 拼接正确的文件路径（处理相对路径）
                        let fullPath = linkHref;
                        // 如果是相对路径（不以/开头），则基于当前加载的MD文件路径拼接
                        if (!fullPath.startsWith("/")) {
                            // 获取当前MD文件的目录（如novel/、novel/chapter/）
                            const currentDir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
                            fullPath = currentDir + fullPath;
                        }
                        // 加载对应的MD文件
                        loadMD(fullPath);
                    });
                }
            });
            // ========== 核心修改结束 ==========

            // 代码高亮
            document.querySelectorAll("pre code").forEach(block => {
                hljs.highlightElement(block);
            });
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(error => {
            document.getElementById("md-content").innerHTML = `<p style="color: #e74c3c;">加载失败：${error.message}</p>`;
            console.error(error);
        });
}

// 加载上一章
function loadPrevChapter() {
    if (currentChapter > 0) {
        loadMD(chapterList[currentChapter - 1].path);
    }
}

// 加载下一章
function loadNextChapter() {
    if (currentChapter < chapterList.length - 1) {
        loadMD(chapterList[currentChapter + 1].path);
    }
}

// 配置marked渲染规则（可选）
marked.setOptions({
    breaks: true, // 换行转换为<br>
    gfm: true,    // 支持GitHub风格的MD
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    }
});