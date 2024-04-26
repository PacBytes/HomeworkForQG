import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Framework from './framework/application.mjs';
import Router from './framework/router/router.mjs';

const { Schema } = mongoose;

function getSecretKey() {
    let secretKey = "forTest";
    return secretKey;
}

async function connectToDatabase() {
    try {
        const uri = "mongodb+srv://fExam:{fExam}--fExam..@learn.zgvz2l9.mongodb.net/QG?retryWrites=true&w=majority&appName=Learn";
        const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
}


function generateToken(payload, secretKey, options={}) {
    return jwt.sign(payload, secretKey, options);
}

function verifyToken(token, secretKey, options={}) {
    try {
        let result = jwt.verify(token, secretKey, options);
        if (result) {
            console.log("-> jwt verify success. user info:");
            console.log(result);
        }
        return result;
    } catch (err) {
        console.log("->X jwt verify failed:");
        console.log(err.name);
        if (err.name === 'TokenExpiredError') {
            return -1;
        }
        // 验证失败
        return null;
    }
}

function verifyPassword (userPassword, dataBasePassword) {
    return userPassword === dataBasePassword;
}

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  sex: String,
  phone: String,
  group: String,
  grade: String,
  nickname: String,
  role: String,
  time: { type: Date, default: Date.now }
}));

const Meeting = mongoose.model('Meeting', new mongoose.Schema({
  name: String,
  time: Date,
  schedule_count: Number,
  view_count: Number,
  schedule_userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendant_info: {
      type: Map,
      of: {
          speak_time: Number
      }
  }
}));

const History = mongoose.model('History', new mongoose.Schema({
  update_time: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  info: String
}));


const defaultRouter = new Router();
const userRouter = new Router();
const adminRouter = new Router();

// 注册和创建不同，注册只能是 user，创建可以是 admin
defaultRouter
// 处理预检请求
    .options("*", async (ctx, next) => {
        ctx.body = " ";
        ctx.status = 200;
        return next();
    })
    .post("/api/register", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.username && obj.password && obj.phone)) {
            ctx.status = 400;
            return next();
        }
        // TODO 可以添加提醒，当用户试图通过这个接口来生成 admin 账户时记录日志和 IP
        obj.role = "user";

        const fUser1 = await User.findOne({
            username: obj.username,
        })
        const fUser2 = await User.findOne({
            phone: obj.phone,
        })

        if (fUser1 || fUser2) {
            ctx.status = 409;
            return next();
        }

        const aUser = new User(obj);
        await aUser.save()
            .then(() => {
                ctx.status = 201;
            })
            .catch(() => {
                ctx.status = 500;
            })
        return next();
    })
    .post("/api/login", async (ctx, next) => {
        ctx.status = 200;
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.username && obj.password)) {
            ctx.status = 400;
            return next();
        }

        let forFindObj = {
            username: obj.username
        }
        // 通过用户名，在数据库里查询到对应的信息
        let result = await User.findOne(forFindObj);
        console.log(result);
        if (result && verifyPassword(obj.password, result.password)) {
            // 生成 token
            const payload = {
                username: result.username,
                role: result.role
            };
            let token = generateToken(payload, getSecretKey(), { expiresIn: '1h' });
            ctx.body = JSON.stringify({authorization: token});
            console.log('Generated token for(', result.username, ' ', result.role, '):', token);
            return next();
        }
        
        ctx.status = 401.1;

        return next();
    })

// userRouter的api有限制，只能查找自己的
userRouter
    .get("/api/user", async (ctx, next) => {
        let token = verifyToken(ctx.headers.authorization, getSecretKey());
        if (!token) {
            ctx.status = 403;
            return next();
        }
        if (token == -1) {
            ctx.status = 401;
            return next();
        }
        let tmp = (await User.find({
            username: token.username,
            role: token.role,
        }))[0];
        delete tmp["_id"];
        ctx.body = JSON.stringify(tmp);
        if (!ctx.body) ctx.status = 204;
        ctx.status = 200;
        return next();
    })
    .get("/api/meetings", async (ctx, next) => {
        // 如果不带查询参数（请求全部）
        if (ctx.url == ctx.path) {
            ctx.body = (await Meeting.find({}).exec()).toString();
        } else {
            ctx.body = (await Meeting.find(ctx.query)).toString();
            if (!ctx.body) ctx.status = 204;
        }
        return next();
    })

adminRouter
    .post("/api/users", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.username && obj.password && obj.phone)) {
            ctx.status = 400;
            return next();
        }

        const aUser = new User(obj);
        console.log("this");
        await aUser.save()
            .then(() => {
                ctx.status = 201;
            })
            .catch(() => {
                ctx.status = 500;
            })
        return next();
    })
    .get("/api/users", async (ctx, next) => {
        // 如果不带查询参数（请求全部）
        if (ctx.url == ctx.path) {
            ctx.body = JSON.stringify((await User.find({}, '-_id').exec()));
        } else {
            ctx.body = JSON.stringify((await User.find(ctx.query, '-_id')));
            if (!ctx.body) ctx.status = 204;
        }
        return next();
    })
    .delete("/api/users", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.username && obj.phone && obj.time)) {
            ctx.status = 400;
            return next();
        }

        let objForDelete = {
            username: obj.username
        }
        
        let result = await User.deleteOne(objForDelete)
            .catch(() => {
                ctx.status = 500;
            });
        if (result.deletedCount){
            ctx.status = 204;
        }
        return next();
    })
    .put("/api/users", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.username && obj.time)) {
            ctx.status = 400;
            return next();
        }

        const forFindObj = {};
        forFindObj.username = obj.username;
        forFindObj.time = obj.time;
        
        let result = await User.findOneAndUpdate(forFindObj, obj);
        if (result) ctx.status = 204;
        return next();
    })
    .get("/api/meetings", async (ctx, next) => {
        // 如果不带查询参数（请求全部）
        if (ctx.url == ctx.path) {
            ctx.body = (await Meeting.find({}).exec()).toString();
        } else {
            ctx.body = (await Meeting.find(ctx.query)).toString();
            if (!ctx.body) ctx.status = 204;
        }
        return next();
    })
    .post("/api/meetings", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.time && obj.name)) {
            ctx.status = 400;
            return next();
        }
        const aMeeting = new Meeting(obj);
        await aMeeting.save()
            .then(() => {
                ctx.status = 201;
            })
            .catch(() => {
                ctx.status = 500;
            })
        return next();
    })
    .delete("/api/meetings", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.name && obj.time)) {
            ctx.status = 400;
            return next();
        }
        
        let result = await Meeting.deleteOne(obj)
            .catch(() => {
                ctx.status = 500;
            });
        if (result.deletedCount) ctx.status = 204;
        return next();
    })
    .put("/api/meetings", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.time && obj.name)) {
            ctx.status = 400;
            return next();
        }

        const forFindObj = {};
        forFindObj.name = obj.name;
        forFindObj.time = obj.time;
        
        let result = await Meeting.findOneAndUpdate(forFindObj, obj);
        if (result) ctx.status = 204;
        return next();
    })
    .get("/api/histories", async (ctx, next) => {
        // 如果不带查询参数（请求全部）
        if (ctx.url == ctx.path) {
            ctx.body = (await History.find({}).exec()).toString();
        } else {
            ctx.body = (await History.find(ctx.query)).toString();
            if (!ctx.body) ctx.status = 204;
        }
        return next();
    })
    .post("/api/histories", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.update_time && obj.userId)) {
            ctx.status = 400;
            return next();
        }
        const aHistory = new History(obj);
        await aHistory.save()
            .then(() => {
                ctx.status = 201;
            })
            .catch(() => {
                ctx.status = 500;
            })
        return next();
    })
    .put("/api/histories", async (ctx, next) => {
        if (!ctx.body){
            ctx.status = 400;
            return next();
        }
        const obj = JSON.parse(ctx.body);
        if (!(obj.update_time && obj.userId)) {
            ctx.status = 400;
            return next();
        }

        const forFindObj = {};
        forFindObj.update_time = obj.update_time;
        forFindObj.userId = obj.userId;
        
        let result = await History.findOneAndUpdate(forFindObj, obj);
        if (result) ctx.status = 204;
        return next();
    })
    ;

startServer();

async function startServer() {
    try {
        const app = new Framework();
        await connectToDatabase();

        app.use((ctx, next) => {
            console.log("\n")
            // 日志：显示请求方法和路径
            console.log(ctx.method + " " + ctx.url);
            // 解决跨域问题
            ctx.res.setHeader('Access-Control-Allow-Origin', '*');
            ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
            ctx.res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            return next();
        });

        // bodyParse
        app.use(async (ctx, next) => {
            let parse_list = ["POST", "DELETE", "PUT"];
            if (~parse_list.indexOf(ctx.method)){
                const req = ctx.request.req
                let reqData = [];
                let size = 0;
                await new Promise((resolve, reject) => {
                    req.on('data', data => {
                        reqData.push(data);
                        size += data.length
                    })
                    req.on('end', () => {
                        const data = Buffer.concat(reqData, size);
                        ctx.request.body = data.toString()
                        resolve();
                    })
                })
            }
            await next();
        })

        // 无权限可操作路由
        app.use(defaultRouter.routes());

        // 权限验证中间件-用户身份大于 user
        app.use(async (ctx, next) => {
            console.log("-> authorization:")
            console.log(ctx.headers.authorization);
            let result = verifyToken(ctx.headers.authorization, getSecretKey());
            if (result == -1) {
                ctx.status = 401;
            }
            if (result) {
                if (result.role === "user" || result.role === "admin"){
                    // 权限大于 user 放行
                    return next();
                }
            }
        })

        app.use(userRouter.routes());

        // 权限验证中间件-用户身份为 admin
        app.use(async (ctx, next) => {
            let result = verifyToken(ctx.headers.authorization, getSecretKey());
            if (result == -1) {
                ctx.status = 401;
            }
            if (result) {
                if (result.role === "admin") {
                    return next();
                } else {
                    let block_list = ["/api/users", "/api/histories", "/api/meetings"];
                    if (~block_list.indexOf(ctx.path)) ctx.status = 403;
                }
            }
        })

        app.use(adminRouter.routes());

        app.listen(3002, () => {
            console.log('Server started on port 3002\n------');
        });

    } catch (error) {
        console.error("Error starting server:", error);
    }
}
