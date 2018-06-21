const userDAO = require('./dao/userDAO');
const pbkdf2Password = require('pbkdf2-password');
const hasher = pbkdf2Password();
exports.welcome = (req,res)=>{
    console.log('req.session.user',req.session)
    res.render('./user/welcome',{user:req.session.user})
}

exports.loginGet = (req,res)=>{
    res.render('./user/login')
}
exports.loginPost=(req,res)=>{
    const {userid,password} = req.body;
    var data = userDAO.getUserInfoById(userid);
        data.then(rows=>{
            if(rows.length){
                return rows[0]
            }else{
                throw new Error('login auth fail!')
            }
        })
        .catch(err=>{
            res.status(500).send(err.message).end()
        })
        .then((data)=>{
            var opt ={
                password : password,
                salt : data.SALT
            }
            return new Promise((resolve,reject)=>{
                hasher(opt,(err,pass,salt,hash)=>{
                    if(data.PASSWORD === hash){
                        console.log('login Success!',userid);
                        resolve(data);
                    }else{
                        reject(new Error('login fail!'))
                    }
                })
            })
        })
        .then(user=>{
            console.log('user...',user)
            const tmp = {
                userid : user.USERID,
                password : user.PASSWORD,
                salt : user.SALT,
                username : user.USERNAME
            }
            console.log('tmp',tmp)
            req.session.user = tmp
            req.session.save(()=>{
                res.redirect('/user/welcome')
            })
        })
        .catch(err=>{
            res.status(500).send(err.message).end()
        })
}
exports.test =(req,res)=>{
    
    const data =userDAO.getUserById('root');
    data.then((rst)=>{
        console.log(rst)
        res.send(rst)
    });
    // ;
}

exports.registerGet=(req,res)=>{
    res.render('./user/register')
}
exports.registerPost=(req,res)=>{
    const{userid,password,username} = req.body;
    const user ={
        userid : userid,
        password : password,
        username : username
    }
    var opt ={password : password}
    hasher(opt,(err,pass,salt,hash)=>{
        user.password=hash;
        user.salt=salt;
        const data = userDAO.insertUser(user);
        data.then(result=>{
            console.log('success count:',result,user);
            if(result){
                req.session.user = user
                return req.session.save(()=>{
                    res.redirect('/');
                })
            }else{
                res.redirect('/user/register')
            }
        }).catch(err=>{
            res.status(500).send(err.message).end()
        })
    })
}

exports.updateGet=(req,res)=>{
    const userid =req.session.user?req.session.user.userid:'root'
    const data = userDAO.getUserInfoById(userid);
    data.then(rows=>{
        if(rows[0]){
            const user={
                userid : rows[0].USERID,
                password : rows[0].PASSWORD,
                username : rows[0].USERNAME,
                salt : rows[0].SALT,
                status : rows[0].STATUS
            }
            res.render('./user/update',{user : user})
        }else{
            throw new Error('not found user');
        }
    })
    .catch(err=>{
        console.log(err.message)
        res.status(500).send(err.message).end();
    })
}

exports.updatePut= async (req,res)=>{
    const {userid, password,username,salt,oriPassword} = req.body;
    console.log('updatePut>',salt)
    //salt랑 passwd는 hidden으로 가지고 있는건 애바...
    //임시로 넣지만 session으로 가지고 있던지 해야할 듯.
    //passport 필요!
    const user ={
        userid : userid,
        password : password,
        username : username,
        salt : salt
    }
    hasher({password : password},(err,pass,salt,hash)=>{
        console.log('???',err,pass,salt,hash,user)
        if(pass){
            user.password=hash
            user.salt = salt
        }else{
            user.password=oriPassword
            // user.salt=user.salt
        }
        console.log(user);

        const data = userDAO.updateUserInfoById(user)
        data.then(rowsAffected=>{
            if(rowsAffected){
                req.session.user = user
                return req.session.save((err)=>{
                    res.redirect('/');
                })
            }else{
                res.redirect('/user/update')
            }
        })

    })
}

exports.deleteGet =(req,res)=>{
    res.render('./user/delete',{userid : 'root'})
}
exports.delete =(req,res)=>{
    const {userid} = req.body
    console.log(userid)
    const data = userDAO.deleteUserById(userid)

    data.then(rowsAffected=>{
        if(rowsAffected){
            res.redirect('/')
        }else{
            res.status(500).send('삭제 실패').end()
        }
    })
    .catch(err=>{
        console.log(err.message)
    })
}

exports.logout=(req,res)=>{
    delete req.session.user;
    req.session.save(()=>{
        res.redirect('/')
    })
}