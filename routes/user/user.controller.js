const userDAO = require('./dao/userDAO');
const pbkdf2Password = require('pbkdf2-password');
const hasher = pbkdf2Password();
exports.welcome = (req,res)=>{
    res.render('./user/welcome')
}

exports.loginGet = (req,res)=>{
    res.render('./user/login')
}
exports.loginPost=(req,res)=>{
    const {userid,password} = req.body;
    var data = userDAO.getUserInfoById(userid);
        data.then(rows=>{
            if(rows[0]){
                var opt ={
                    password : password,
                    salt : rows[0].SALT
                }
                return hasher(opt,(err,pass,salt,hash)=>{
                    if(rows[0].PASSWORD === hash){
                        console.log('login Success!',userid);
                        res.redirect('/');
                    }else{
                        console.log('login Fail!',userid,password);
                        res.redirect('/user/login')
                    }
                })
            }else{
                throw new Error('login fail')
                // console.log('login Fail!',userid,password);
                // res.redirect('/user/login')
            }
        }).catch(err=>{
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
            console.log('success count:',result);
            if(result){
                res.redirect('/');
            }else{
                res.redirect('/user/register')
            }
        }).catch(err=>{
            res.status(500).send(err.message).end()
        })
    })
}

exports.updateGet=(req,res)=>{
    const userid ='root'
    const data = userDAO.getUserInfoById(userid);
    data.then(rows=>{
        res.render('./user/update',{user : rows[0]})
    })
    .catch(err=>{
        console.log(err.message)
        res.status(500).send(err.message).end();
    })
}

exports.updatePut= async (req,res)=>{
    const {userid, password,username,salt,oriPassword} = req.body;
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
        console.log(err,pass,salt,hash,user)
        if(pass){
            user.password=hash
            user.salt = salt
        }else{
            user.password=oriPassword
            user.salt=user.salt
        }
        console.log(user);

        const data = userDAO.updateUserInfoById(user)
        data.then(rowsAffected=>{
            if(rowsAffected){
                res.redirect('/')
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