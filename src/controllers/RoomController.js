const Database = require("../db/config")

function idGenerator() {
    let id = "";

    for (var i = 0; i < 6; i++) {
      id += Math.floor(Math.random() * 10);
    }

    return parseInt(id);
}

module.exports = {
    async create(req, res){
        const db = await Database()
        const pass = req.body.password
        
        let roomId
        do {
            roomId = idGenerator()
            hasId = await db.get('SELECT id FROM rooms WHERE rooms.id=?', roomId)
        } while (hasId);
        
        try {
            await db.run(`INSERT INTO rooms (
                id,
                pass
            ) VAlUES (
                ${roomId},
                '${pass}'
            )`)
        
            res.redirect(`/room/${roomId}`)
        }
        catch (error) {
            console.log(error)
            res.redirect(`/create-pass`)
        }
        finally {
            await db.close()
        }
    },
    async open(req, res){
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)
        let isNoQuestions

        if(questions.length ==0){
            if(questionsRead.length == 0){
                isNoQuestions = true
            }
        }

        res.render("room", {roomId, questions, questionsRead, isNoQuestions})
    },
}