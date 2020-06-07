const express = require("express") //a função vai retornar  valor para o express 
const server = express() // estou executando a função express no servidor

//pegar o banco de dados
const db = require("./database/db")

//configurar a pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicaçõa
server.use(express.urlencoded({ extended: true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true  // isso é necessario para atualizar dados de informação, caso contrario ele entrega dados antigos sem atualização
})



// configurar caminhos da minha aplicação
// pagina inicial
// req é requisição
// res é resposta

 server.get("/", (req, res) => {

   return res.render("index.html", {title: "um titlo"})  // render para renderisar 
})






 server.get("/create-point", (req, res) => {

    //req.query são as query string das nossas urls
    console.log(req.query)

   return res.render("create-point.html") 

    })


server.post("/savepoint", (req, res) => {


    // req.body: o corpo do nosso formulario
console.log(req.body)

//inserir os dados no banco de dados

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);    
`

    const values = [
   req.body.image,
   req.body.name,
   req.body.address,
   req.body.address2,
   req.body.state,
   req.body.city,
   req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
             console.log(err)
             return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)
        
    return res.render("create-point.html", {saved: true})
    }

db.run(query, values, afterInsertData)

})


server.get("/search", (req, res) => {

const search = req.query.search

if(search == "") {
    //pesquisa vazia
     return res.render("search-results.html", { total: 0}) 
    
}

        // pegar os dados do bancode dados         
   db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

                //mostrar a pagina html com os dados do banco de dados
                return res.render("search-results.html", { places: rows, total: total}) 
     })
        
         })
     

/*
server.get("/", (req, res) => {
res.render(__dirname + "/views/index.html")  //.sendFile para buscar o arquivo. __dirname é uma variavel que recebe o caminho para o arquivo.
})

server.get("/create-point", (req, res) => {
    res.render(__dirname + "/views/create-point.html")  //.sendFile para buscar o arquivo. __dirname é uma variavel que recebe o caminho para o arquivo.
    })

server.get("/search-results", (req, res) => {
        res.render(__dirname + "/views/search-results.html")  //.sendFile para buscar o arquivo. __dirname é uma variavel que recebe o caminho para o arquivo.
        })
*/



//ligar o servidor
server.listen(3000)




