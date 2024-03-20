## Git 学习笔记

### 01 安装与初始化

**安装**

「Linux」

```sh
sudo pacman -S git
```

「Windows」

- 安装 Msys2（略）
- 配置镜像源（略）

```sh
 pacman -Sy | pacman -S git
```

**初始化**

```sh
git init # 为当前目录初始化
git init XXX # 初始化 XXX 
```



### 02 架构

[目录]  --  [暂存区]  --  [本地仓库]  --  [远程仓库]



### 03 基本操作和命令



| 命令                                | 说明                                     |
| ----------------------------------- | ---------------------------------------- |
| `git add`                           | 添加文件到暂存区                         |
| `git status `                       | 查看仓库当前的状态，显示有变更的文件。   |
| `git diff `                         | 比较文件的不同，即暂存区和工作区的差异。 |
| `git commit `                       | 提交暂存区到本地仓库。                   |
| `git reset `                        | 回退版本。                               |
| `git rm `                           | 将文件从暂存区和工作区中删除。           |
| `git mv `                           | 移动或重命名工作区文件。                 |
| `git checkout `                     | 分支切换。                               |
| `git switch （Git 2.23 版本引入）`  | 更清晰地切换分支。                       |
| `git restore （Git 2.23 版本引入）` | 恢复或撤销文件的更改。                   |

#### 提交日志

| 命令                       | 说明                                 |
| -------------------------- | ------------------------------------ |
| `git log`                  | 查看历史提交记录                     |
| `git blame <file>        ` | 以列表形式查看指定文件的历史修改记录 |

#### 远程操作

| 命令               | 说明               |
| ------------------ | ------------------ |
| `git remote`       | 远程仓库操作       |
| `git fetch `       | 从远程获取代码库   |
| `git pull    `     | 下载远程代码并合并 |
| `git push        ` | 上传远程代码并合并 |



### 04 添加 SSH KEY

这样每次就不用输入 Github 密码了:）

**01 配置远程仓库协议为 GIT 协议**

```sh
git remote set-url origin git@github.com:xxx/xxx.git
```

**02 生成 SSH 密钥**

```bash
ssh-keygen -t ed25519 -C "<github email>"
# 注意，设置的这个 passphrase 是以后要输入的，可以设置简单点
# Enter passphrase (empty for no passphrase): 
# -----------------------------------------------
# 还不支持ed25519算法的旧版本
ssh-keygen -t rsa -b 4096 -C "<github email>""
```

**03 添加密钥到ssh-agent**

```text
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519 # 或者其他名字
```

 **04 添加公钥到 Github 账户**

```bash
cat ~/.ssh/id__ed25519.pub # 或者其他名字
# 把终端输出的内容复制到Github账户中
# 点击头像 -> Setting -> SSH and GPG keys
# Title 随便，粘贴 Keys 即可
```

![image-20240320130926134.png](https://s2.loli.net/2024/03/20/F9wVGg3hay2ot1d.png)

**04 验证**

执行完上述两步操作后，正常情况下已经配置成功了，此时可以验证一下：

```bash
ssh -T git@github.com
# 如果输出以下内容，则表示配置成功。（记得关闭代理）
# Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

