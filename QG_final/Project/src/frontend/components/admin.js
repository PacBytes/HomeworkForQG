let template = /* html */ `
<link rel="stylesheet" href="./css/userSetting.css">
<div id="userSetting">
    <h2>用户管理</h2>
    <div class="search-wrapper">
        <div class="header">搜索</div>
        <div class="form-wrapper">
            <div class="input-wrapper">
                <div class="input-item">
                    <span>用户名</span>
                    <input type="text" name="username" placeholder="请输入用户名">
                </div>
                <div class="input-item">
                    <span>昵称</span>
                    <input type="text" name="nickname" placeholder="请输入昵称">
                </div>
                <div class="input-item">
                    <span>性别</span>
                    <input type="text" name="sex" placeholder="请输入性别">
                </div>
                <div class="input-item">
                    <span>手机号</span>
                    <input type="text" name="phone" placeholder="请输入手机号码">
                </div>
                <div class="input-item">
                    <span>组别</span>
                    <input type="text" name="group" placeholder="请输入组别">
                </div>
                <div class="input-item">
                    <span>年级</span>
                    <input type="text" name="grade" placeholder="请输入年级">
                </div>
                <div class="input-item">
                    <span>角色</span>
                    <input type="text" name="role" placeholder="请输入用户身份">
                </div>
                <div class="input-item">
                    <span>注册时间</span>
                    <input type="text" name="time" placeholder="请输入注册时间">
                </div>
            </div>
            <div class="button-wrapper">
                <button class="reset" onclick="clearInputs()"><i class='bx bx-reset'></i>重置</button>
                <button class="search" onclick="queryUser(1)"><i class='bx bx-search'></i>搜索</button>
            </div>
        </div>
    </div>

    <div class="list-wrapper">
        <div class="header-wrapper">
            <div class="header">用户列表</div>
            <div class="button-wrapper">
                <button class="add" onclick="addUserTableRow('userTable')"><i class='bx bx-add-to-queue' ></i>新增</button>
                <button class="search" onclick="queryUser(0)"><i class='bx bx-refresh' ></i>刷新</button>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-wrapper">
                <table id="userTable">
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>昵称</th>
                            <th>性别</th>
                            <th>电话号码</th>
                            <th>组别</th>
                            <th>年级</th>
                            <th>时间</th>
                            <th>角色</th>
                            <th>操作</th>
                          </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
            </div>
        </div>
        
    </div>
</div>
`

let template2 = /* html */ `
<div id="historySetting">
    <p>历史记录管理菜单</p>
    <button onclick="">点击我</button>
</div>
`

function queryUser(code){
    let url = "/api/users";
    if (code == 1) {
        // 选择所有输入元素
        const inputs = document.querySelectorAll('.input-wrapper input');

        const params = [];
        inputs.forEach(input => {
            const paramName = input.getAttribute('name');
            const paramValue = input.value.trim();
            if (paramValue !== '') {
                params.push(paramName+'='+paramValue);
            }
        });

        const queryParams = params.join('&');
        url = "/api/users?"+queryParams;
    }
    

    function updateUserFunction(updatedUserInfo){
        fetch("/api/users", {
            method: "PUT",
            body: updatedUserInfo,
        }).then((res)=>{
            if (res.status == 204) {
                alert("更新成功！");
            }
        })
    }

    function deleteUserFunction(userInfo) {
        fetch("/api/users", {
            method: "DELETE",
            body: userInfo,
        }).then((res)=>{
            if (res.status == 204) {
                alert("删除成功！");
            }
        })

    }

    fetch(url, {
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 处理返回的数据
            console.log(data);
            let cells = ['username', 'nickname', 'sex', 'phone', 'group', 'grade', 'time', 'role'];
            updateTable(data, "userTable", cells, updateUserFunction, deleteUserFunction);
        });
}




export { template as userSettingHTML, template2 as historySettingHTML, queryUser};