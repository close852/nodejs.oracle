var oracledb = require('oracledb');
      oracledb.outFormat = oracledb.OBJECT;
var dbConfig = require('../../config/oracleConfig');
exports.welcome = (req,res)=>{
    res.send('Welcome!')
}

exports.login = (req,res)=>{
    res.render('./user/login')
}

exports.postLogin = (req,res)=>{
    var conn;
    const {userid, password} = req.body;
    console.log(userid,password);
    const sql ='select userid, password from t_user where userid=:userid'
    const params={
        userid : userid
    }
    oracledb.getConnection(dbConfig)
    .then(c=>{
        conn = c;
        return conn.execute(sql,params);
    })
    .then(result=>{
        console.log(result.rows)
        return result.rows;
    }).catch(e=>console.log(e.message))
    .then(data=>{
        if(data[0].USERID===userid && data[0].PASSWORD===password){
            console.log('login success');
            res.redirect('/user/welcome');
        }
    })
    .then(doRelease(conn))
    .catch(err => console.error(err.message))
}

doRelease= (conn)=>{
    if(conn){
        conn.close((err)=>{
            if(err){
                console.log(err.message);
            }
        });
    }
}