const express = require('express');
const app = express();
const keys = require('./keys');
const bodyParser = require('body-parser')
const sql = require('mssql');
const port = 3000;
const connStr = keys.dbString
const cors = require('cors');
console.log('chave : '+ connStr);

//conexão global
sql.connect(connStr)
    .then(conn => global.conn = conn)
    .catch(err => console.log('Erro de banco ' + err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const router = express.Router();

router.get('/' , (req ,res) => res.json({message:'Funcionando!'}));
app.use('/' , router);

function execQuery(cQuery,res){
    global.conn.request()
        .query(cQuery)
        .then(result => res.json(result.recordset))
        .catch( err => res.json(err));

}
router.get('/produtos/:id?' , (req,res) => {
    var query =  " SELECT   B1_MSBLQL    AS Bloqueado,  "
        query += " RTRIM(LTRIM(B1_COD))  AS Codigo,     " 
        query += " RTRIM(LTRIM(B1_DESC)) AS Descricao , "
        query += " B1_BALANCA as Balanca , RTRIM(LTRIM(B1_CODBAR)) as Cod_Barras "
        query += " FROM SB1010 "
        query += " WHERE D_E_L_E_T_ <> '*' "
        if (req.params.id) {
            query += " AND B1_COD = '"+req.params.id+"' "
        }
        query += " ORDER BY B1_DESC "
        
    execQuery(query ,res);
})

router.get('/produtos/like/:desc?' , (req,res) => {
    var query =  " SELECT   B1_MSBLQL    AS Bloqueado,  "
        query += " RTRIM(LTRIM(B1_COD))  AS Codigo,     " 
        query += " RTRIM(LTRIM(B1_DESC)) AS Descricao , "
        query += " B1_BALANCA as Balanca , RTRIM(LTRIM(B1_CODBAR)) as Cod_Barras "
        query += " FROM SB1010 "
        query += " WHERE D_E_L_E_T_ <> '*' "
        if (req.params.desc) {
            query += " AND B1_DESC LIKE'%"+req.params.desc.toUpperCase()+"%' "
        }
        query += " ORDER BY B1_DESC "
        
    execQuery(query ,res);
})



app.listen(port);
console.log('API no Ar')