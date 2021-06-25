const Database = require("../db/config")

module.exports = {
    async create(req, res){
        const db = await Database()
        const pass = req.body.password
        let roomId = ''

        for(var i = 0; i < 6; i++){
            roomId += Math.floor(Math.random() * 10).toString()
        }

        try {
            await db.run(`INSERT INTO rooms (
                id,
                pass
            ) VAlUES (
                ${parseInt(roomId)},
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
    }
}