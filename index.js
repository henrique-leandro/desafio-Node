const express = require('express')
const uuid = require('uuid')


const port = 3000
const app = express()
app.use(express.json())


const orders = []


const checkOrderId = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id) // procura se o id que colocar na url depois do caminho tem usurio com esse id
     
     if(index < 0 ){
        return response.status(404).json({error: "Order Not Found"}) // essa é a mensagem que aparece se não encontrar o index do usurio com esse id
     }

    request.OrderIndex = index 
    request.OrderId = id
 
    
    next()
}

const checkMiddleware = (request, response, next) => {
    console.log('Request URL:', request.originalUrl)
    console.log('Request type:', request.method)

    next()
}

app.post('/order', checkMiddleware, (request, response) => {  //criar o pedido do cliente com o id e o status

    const {order, clientName, price} = request.body

    const newOrder = {id: uuid.v4(), order, clientName, price, status: "Em Preparação"}


    orders.push(newOrder)


    return response.status(201).json(newOrder)
})


app.get('/order', checkMiddleware, (request, response) => { // veririca quais são os pedidos
    return response.json(orders)
})


app.put('/order/:id', checkOrderId, checkMiddleware, (request, response ) =>{  // faz alteração no pedido


    const {order, clientName, price, status} = request.body
    
    const index = request.OrderIndex
    const id = request.OrderId

    const orderUpdate = {id, order, clientName, price, status}

    orders[index] = orderUpdate

    return response.json(orderUpdate)

})


app.delete('/order/:id', checkOrderId, checkMiddleware,(request, response ) => {
     
    const index = request.OrderIndex

    orders.splice(index,1)

    return response.status(200).json({message: "User deleted!"})
})

app.get('/order/:id', checkOrderId, checkMiddleware, (request, response) => { // veririca o pedido de acordo com o id passado nos parametros

    const index = request.OrderIndex
    const id = request.id


    return response.json(orders[index])
})

app.patch('/order/:id', checkOrderId, checkMiddleware, (request, response) => {


    const {order, clientName, price, status} = request.body

    const index = request.OrderIndex
    const id = request.OrderId
    
    const newStatusOrder = {id, order, clientName, price, status}
    
    const newStatus = orders.filter(element => element.id === id).map(element => {

        const news = {
            id: element.id,
            order: element.order,
            clientName: element.clientName,
            price: element.price,
            status: 'Pronto'
        }

        return response.json(news)
    })

    

})

app.listen(port, () =>{
    console.log(`Server starded on port ${port} 🚀`)
})




