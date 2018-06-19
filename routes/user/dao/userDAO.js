var oracledb = require('oracledb');
var dbConfig = require('../../../config/oracleConfig');
var path = require('path');
exports.insertUser=(user)=>{
    const sql = 'insert into t_user(userid,password,username) values(:userid,:password,:username)'
    const params ={
        userid : user.userid,
        password : user.password,
        username : user.username
    }
    return new Promise((resolve,reject)=>{
        let conn;
        oracledb.getConnection(dbConfig)
        .then(c=>{
            conn = c
            console.log('DB Connected!')
            return conn.execute(sql,params,{autoCommit:true})
        })
        .then(result=>{
            console.log('==== execute query ====\n',__filename,'\n',sql,params,'\n==== execute query ====')
            resolve(result.rowsAffected);
        }).catch(err=>{
            console.log('ERROR!! ',err.message);
            reject(err);
        })
        .then(()=>{
            if(conn){
                return conn.close();
            }
         })
         .then(()=> console.log('Connection Closed'))
         .catch(err=>{
             console.log('Error closing connection ',err);
         })
    })
}
exports.getUserInfoById=(userid)=>{
    const sql ='select userid, password,username from t_user where userid=:userid and status=1'
    const params={
        userid : userid
    }
    return new Promise((resolve,reject)=>{
        let conn;
        oracledb.getConnection(dbConfig)
        .then(c=>{
            console.log('DB Connected!');
            conn = c;
            return conn.execute(sql,params,{outFormat:oracledb.OBJECT})
        })
        .then(result=>{
            console.log('==== execute query ====\n',__filename,'\n',sql,params,'\n==== execute query ====')
            resolve(result.rows);
        }).catch(err=>{
            console.log('ERROR!! ',err.message);
            reject(err);
        })
        .then(()=>{
            if(conn){
                return conn.close();
            }
         })
         .then(()=> console.log('Connection Closed'))
         .catch(err=>{
             console.log('Error closing connection ',err);
         })
    })
}

