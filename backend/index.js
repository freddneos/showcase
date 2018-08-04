/*
    Projeto de estudo mean stack com cenário Real e aplicável
    Empresa : Casas Pedro (Rio de janeiro - Brasil)
    Autor : Frederico Bezerra (NeosDev)
*/
const express = require('express');
const app = express();
//git ignore , keys de acesso ao banco
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

//uso do body parser
//usro do cors
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const router = express.Router();

//main route , rota principal
router.get('/' , (req ,res) => res.json({message:'Funcionando!'}));
app.use('/' , router);


//função que executa a query
function execQuery(cQuery,res){
    global.conn.request()
        .query(cQuery)
        .then(result => res.json(result.recordset))
        .catch( err => res.json(err));

}
//rota de listagem de dados da query , parametro de id opcional para ja trazer produto especifico
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
//Rota de busca por descrição o parte dela, parametro obrigatório
router.get('/produtos/like/:desc' , (req,res) => {
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

//porta que o server vai escutar
app.listen(port);
console.log('API no Ar')