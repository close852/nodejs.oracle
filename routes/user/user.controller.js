const userDAO = require('./dao/userDAO');

exports.welcome = (req,res)=>{
    res.send('Welcome!')
}

exports.loginGet = (req,res)=>{
    res.render('./user/login')
}
exports.loginPost=(req,res)=>{
    const {userid,password} = req.body;
    var data = userDAO.getUserInfoById(userid);
    data.then(rows=>{
        if(rows[0].USERID==userid && rows[0].PASSWORD ==password){
            console.log('login Success!',userid);
            res.redirect('/');
        }else{
            console.log('login Fail!',userid,password);
            res.redirect('/user/login')
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
    var data = userDAO.insertUser(user);
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
}