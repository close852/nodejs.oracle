var oracledb = require('oracledb');
var dbConfig = require('../../../config/oracleConfig');
var path = require('path');
exports.insertUser= async (user)=>{
    const sql = 'insert into t_user(userid,password,username,salt) values(:userid,:password,:username,:salt)'
    const params ={
        userid : user.userid,
        password : user.password,
        username : user.username,
        salt : user.salt
    }
    let conn;
    try{
        conn = await oracledb.getConnection(dbConfig)
        console.log('DB Connected!')
        const result = await conn.execute(sql,params);
        await conn.commit()
        .then(()=>{
            console.log('commit :',result.rowsAffected)
        })
        .catch(err=>console.log(err.message));
        return result.rowsAffected;
    }catch(err){
        await conn.rollback().then(()=>{
            console.log('rollback :',err.message)
        })
        .catch(err=>console.error('rollback err',err.message));
    }finally{
        dbRelease(conn);
    }
}



exports.getUserInfoById= async (userid)=>{
    const sql ='select userid, password,username,salt from t_user where userid=:userid and status=1'
    const params={
        userid : userid
    }
    let conn;
    try{
        conn = await oracledb.getConnection(dbConfig);
        console.log('DB Connected!')
        console.log('<==== execute query ====>\n',sql,'\n params :',params,'\n',__filename,'\n</==== execute query ====>')
        const result = await conn.execute(sql,params,{outFormat:oracledb.OBJECT})
        return result.rows;
    }catch(err){
        console.error('ERROR~~!!',err.message)
        throw new Error(err)
    }finally{
        await dbRelease(conn);     
    }
}
dbRelease= async (conn)=>{
    if(conn){
        await conn.close()
        .then(()=>console.log('Connection closed'))
        .catch(err=>{
            console.error('closed error',err.message);
        })
    }
}
exports.updateUserInfoById = async (user)=>{
    const sql = ' update t_user '+
                ' set userid=:userid,password=:password,username=:username,salt=:salt '+
                ' where userid=:userid '
    const params ={
        userid : user.userid,
        password : user.password,
        username : user.username,
        salt : user.salt
    }
    let conn;
    try{
        conn = await oracledb.getConnection(dbConfig)
        console.log('DB Connected!')
        const result = await conn.execute(sql,params);
        await conn.commit()
        .then(()=>{
            console.log('commit :',result.rowsAffected)
        })
        .catch(err=>console.log(err.message));
        return result.rowsAffected;
    }catch(err){
        await conn.rollback().then(()=>{
            console.log('rollback :',err.message)
        })
        .catch(err=>console.error('rollback err',err.message));
    }finally{
        dbRelease(conn);
    }
} 

exports.deleteUserById =async (userid)=>{
    const sql = ' update t_user '+
                ' set status=:status '+
                ' where userid=:userid '
    const params ={
        userid : userid,
        status : '9'
    }
    let conn;
    try{
        conn = await oracledb.getConnection(dbConfig)
        console.log('DB Connected!')
        const result = await conn.execute(sql,params);
        await conn.commit()
        .then(()=>{
            console.log('commit :',result.rowsAffected)
        })
        .catch(err=>console.log(err.message));
        return result.rowsAffected;
    }catch(err){
        await conn.rollback().then(()=>{
            console.log('rollback :',err.message)
        })
        .catch(err=>console.error('rollback err',err.message));
    }finally{
        dbRelease(conn);
    }
}
