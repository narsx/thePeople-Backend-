const controller = {}
const User = require("../models/user")
const authJWT = require("../auth/jwt")

controller.signup = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        res.status(400).send()
        return
    }
    try {
        const exists = await User.findOne({ email: email })
        if (exists) {
            console.log("usuario ya existe")
            res.status(400).send("usuario ya existe")
            return
        }
        const user = new User({ email: email, password: password })
        await user.save()
        const data = await User.findOne({ email: email })
        res.send({ status: "ok", data: data })
    } catch (err) {
        console.log(err)
        res.status(500).send("Error")
    }

}

controller.login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        console.log("datos obligatorios")
        res.status(401).send("Credenciales incorrectas")
        return
    }

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            console.log("usuario no existe")
            res.status(401).send("Credenciales incorrectas")
            return
        }

        const validate = await user.isValidPassword(password)
        if (!validate) {
            console.log("contraseña incorrecta")
            res.status(401).send("Credenciales incorrectas")
            return
        }

        const dataToken = authJWT.createToken(user)

        return res.send({
            access_token: dataToken[0],
            expires_in: dataToken[1]
        })

    } catch (err) {
        console.log(err)
        res.status(500).send("Error")
    }
}

module.exports = controller