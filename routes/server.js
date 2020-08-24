const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.use(express.static(__dirname + '/public'))

// http.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`)
// })




app.get('/', (req, res) => {
    res.render('chatbot');
})

app.listen(4200)


// // Socket 
// const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    // socket.on('message', (msg) => {
    //     socket.broadcast.emit('message', msg)
    // })

})


