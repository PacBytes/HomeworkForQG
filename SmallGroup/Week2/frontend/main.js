// 加载文件列表展示栏
function displayFileList(button) {
    // 通过相对定位确定 toolbarDiv 元素，便于后续添加展示栏对象
    let toolbarDivElement = button.parentNode.parentNode;
    // 获取文件列表对象
    let fileListElement = toolbarDivElement.querySelector("#fileList");
    // 按一次创建，再按一次删除
    if (fileListElement) {
        removeElement(fileListElement);
        // 封装一下，重构屎山代码，由于该组件以及被删除了，可以删除失焦事件
        removeEventListener('click', fileListBlurEvent);
    } else {
        // 创建对象
        fileListElement = createFileListElement(toolbarDivElement);
        // 添加失焦事件
        addEventListener('click', fileListBlurEvent);
    }
}

// 载入文件
function loadFile(div){
    // 获得标题和正文对象，以及加载的文件名
    let contentElement = document.getElementById("content");
    let headElement = document.getElementById("head");
    let fileName = div.innerHTML;

    // 将文件名填入 head 中，将内容填入 content 中
    if (fileName) {
        headElement.innerText = fileName;
        contentElement.innerHTML = localStorage.getItem(fileName);
    }

    // 移除文件选择框
    let fileListElement = document.querySelector("#fileList");
    removeElement(fileListElement);
}

// 保存文件
function saveFile() {
    // 获得 content 和 head 元素中的内容
    const content = document.getElementById('content').innerHTML;
    const fileName = document.getElementById('head').innerText;
    if (fileName) {
        // 解析 saveFiles 对应的值
        let savedFiles = JSON.parse(localStorage.getItem('savedFiles')) || [];
        // 如果 saveFiles 不包含文件名（新文件），才添加进列表
        if (!savedFiles.includes(fileName)) {
            savedFiles.push(fileName);
        }
        // 更新 savedFiles 值
        localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
        // 保存文件
        localStorage.setItem(fileName, content);
        alert('文件已保存');
    } else {
        alert('至少得有个标题！（作为文件名）');
    }
}

// 删除文件
function removeFile(button) {
    // 获得删除按钮前的 div（储存有文件名）
    let fileDivElement = button.previousSibling;
    let fileName = fileDivElement.innerHTML;
    // 获取 savedFiles
    let savedFiles = JSON.parse(localStorage.getItem('savedFiles')) || [];
    if (fileName) {
        // 改变 savedFiles
        savedFiles = savedFiles.filter(element => element !== fileName);
        // 删除文件
        if (localStorage.getItem(fileName)) {
            localStorage.removeItem(fileName);
            alert('文件已删除');
        }
    }
    // 更新 savedFiles
    localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
    // 关闭 fileList 展示栏
    let fileListElement = document.querySelector("#fileList");
    removeElement(fileListElement);
}

// 搜索
function displaySearchBar(button) {
    // 找到 toolbar 节点元素
    let toolbarDivElement = button.parentNode.parentNode;
    let searchBarElement = toolbarDivElement.querySelector("#searchBar");
    // 再次点击关闭 searchBar
    if (searchBarElement) {
        // 关闭 searchBar，取消高亮
        removeElement(searchBarElement);
        clearHighlight();
    } else {
        searchBarElement = createSearchBar(toolbarDivElement);
    }
}

// 运行搜索
function runSearch() {
    // 清除上一次高亮
    clearHighlight();
    let searchString = document.getElementById("searchInput").value.trim();
    if (searchString === "") return;
    // 获取内容，准备进行高亮处理
    let content = document.getElementById("content").innerHTML;
    // 构建正则表达式，修复了查找 d div 等破坏 div 标签的错误
    let regex = new RegExp("(?![^<]+>)(" + searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ")(?![^<]+>)", "gi");
    // 获取匹配列表
    let matches = content.match(regex);
    if (matches !== null) {
        document.getElementById("content").innerHTML = content.replace(regex, "<span class='highlight'>$1</span>");
        let firstMatch = document.querySelector('.highlight');
        if (firstMatch) {
            firstMatch.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    } else {
        alert("未找到匹配的词语：" + searchString);
    }
    // let searchBarElement = document.querySelector("#searchBar");
    // TODO，上下选择
}

// 在失去焦点后关闭文件列表栏
function fileListBlurEvent(event) {
    let fileListElement = document.querySelector("#fileList");
    if (!toolbarDiv.contains(event.target)) {
        if (fileListElement) {
            removeElement(fileListElement);
            removeEventListener('click', fileListBlurEvent);
        }
    }
}

// 在失去焦点后关闭搜索框
// function searchBarBlurEvent(event) {
//     let searchBarElement = document.querySelector("#searchBar");
//     if (!toolbarDiv.contains(event.target)) {
//         if (searchBarElement) {
//             removeElement(searchBarElement);
//             removeEventListener('click', searchBarBlurEvent);
//         }
//     }
// }

// 创建文件展示栏元素
function createFileListElement(toolbarDivElement) {
    let fileListElement = document.createElement("div");
    fileListElement.id = "fileList";
    toolbarDivElement.appendChild(fileListElement);
    const savedFiles = JSON.parse(localStorage.getItem('savedFiles')) || [];
    if (savedFiles.length > 0) {
        savedFiles.forEach((file, index) => {
            fileListElement.innerHTML += `<div style="display:flex;justify-content:center space-around;align-items:center;"><span>${index+1} | </span><div onclick='loadFile(this)' style='display: inline-block;'>${file}</div><button onclick="removeFile(this)" style="padding-top: 5px;"><img src='delete.svg'></img></button></div>`;
        });
    } else {
        alert('没有保存的文件');
    }
    return fileListElement;
}

// 创建搜索框
function createSearchBar(toolbarDivElement) {
    let searchBar = document.createElement("div");
    searchBar.id = "searchBar";
    searchBar.innerHTML = "<input id='searchInput' type='text' placeholder='请输入要搜索的词语' style='border: none; outline: none;'><a>|</a><button onclick='runSearch()'>搜索</button>";
    toolbarDivElement.appendChild(searchBar);
    return searchBar;
}

// 移除元素
function removeElement(element) {
    if (element.parentElement != null) {
        element.parentNode.removeChild(element);
    }
}

// 取消高亮
function clearHighlight() {
    let content = document.getElementById("content");
    content.innerHTML = content.innerHTML.replace(/<span class=['"]highlight['"]>(.*?)<\/span>/g, "$1");
    content.innerHTML = content.innerHTML.replace(/<span class=['"]highlight['"]>(.*?)<\/span>/g, "$1");
}
