let template = /* html */ `
<link rel="stylesheet" href="./css/profile.css">
<div id="profile">
    <div class="center">
        <div class="front-face">
            <div class="contents front">
                <h2 class="profile-username-big">Pacbytes</h2>
                <p>QG 会议系统正式成员</p>
            </div>
        </div>
        <div class="back-face">
            <div class="contents back">
                <h2 class="profile-username-big">Pacbytes</h2>
                <p>A member in QG Meeting Data Visualization System</p>  
                <div id="profile-username">用户名: Pacbytes</div>
                <div id="profile-nickname">用户昵称: Pac</div>
                <div id="profile-sex">性别: 男</div>
                <div id="profile-phone">手机号: 123456</div>
                <div id="profile-group">组别: 前端组</div>
                <div id="profile-grade">年级: 23级</div>
                <div id="profile-role">身份: 用户</div>
            </div>
        </div>
    </div>
</div>
`

function render() {
    const username_big = document.getElementsByClassName("profile-username-big");
    const username = document.getElementById("profile-username");
    const nickname = document.getElementById("profile-nickname");
    const sex = document.getElementById("profile-sex");
    const phone = document.getElementById("profile-phone");
    const group = document.getElementById("profile-group");
    const grade = document.getElementById("profile-grade");
    const role = document.getElementById("profile-role");
    
    
    fetch("/api/user", {
        method: "GET",
    }).then((res)=>{
        if (res.status == 403 || res.status == 401) window.location.href = "./login.html";
        if (res.status == 200) {
            res.json().then((data)=>{
                username_big[0].innerHTML = data.username;
                username_big[1].innerHTML = data.username;
                username.innerHTML = "用户名："+(data.username);
                nickname.innerHTML = "昵称："+(data.nickname || "");
                sex.innerHTML = "性别："+(data.sex || "");
                phone.innerHTML = "手机号："+(data.phone);
                group.innerHTML = "组别："+(data.group || "");
                grade.innerHTML = "年级："+(data.grade || "");
                role.innerHTML = "身份："+(data.role || "");
            })
        }
    })
}

export { template as profileHTML, render as profileRender};