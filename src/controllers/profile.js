const controller = {}

const Profile = require("../models/profile")

controller.saveProfile = async (req, res) => {

    const name = req.body.name
    const surname = req.body.surname
    const job = req.body.job
    const biography = req.body.biography
    const picture = req.body.picture
    const birthday = req.body.birthday

    if (!name || !surname || !job || !biography || !picture || !birthday) {
        res.status(400).send()
        return
    }
    try {
        const profile = new Profile({ name: name, surname: surname, job: job, biography: biography, picture: picture, birthday: birthday })
        await profile.save()
        res.status(201).send()
    } catch (err) {
        res.status(500).send(err)
    }


}

controller.getProfilesV1 = async (req, res) => {
    const filter = req.query.search
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    /*
    
    db.profiles.find({ $text : { $search: 'Gates', $caseSensitive:false } }); 
    */

    //TODO revisar filtro regex
    //"$regex": "^" + id }

    let query = {}

    if (filter || (startDate && endDate)) {
        query.$or = []
    }

    if (filter) {
        query.$or.push({ name: new RegExp(filter, 'i') })
        query.$or.push({ surname: new RegExp(filter, 'i') })
    }

    if (startDate && endDate) {
        query.$or.push({
            birthday: {
                $gte: startDate,
                $lte: endDate
            }
        })
    }

    try {
        const profiles = await Profile.find(query)
        res.send({ data: profiles })
    } catch (error) {
        console.log(error)
        res.status(500).send("ocurrió un error")
    }

}

controller.getProfiles = async (req, res) => {
    const filter = req.query.search
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    const filters = []

    if (filter) {
        filters.push({ fullname: new RegExp(filter, 'i') })
    }

    if (startDate && endDate) {
        filters.push({
            "birthday": {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
    }

    try {
        let profiles = {}
        if (filters.length > 0) {

            profiles = await Profile.aggregate([
                { $addFields: { fullname: { $concat: ["$name", " ", "$surname"] } } },
                {
                    $match: { $and: filters }
                }
            ])
        } else {
            profiles = await Profile.find()
        }

        res.send(profiles)
    } catch (error) {
        console.log(error)
        res.status(500).send("ocurrió un error")
    }

}

controller.getProfile = async (req, res) => {
    const id = req.params.id

    try {
        const profile = await Profile.findById(id)
        res.json(profile)
        console.log(profile)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "El perfil no existe" })
    }
}

controller.updateProfile = async (req, res) => {
    const id = req.params.id
    const name = req.body.name
    const surname = req.body.surname
    const job = req.body.job
    const biography = req.body.biography
    const picture = req.body.picture
    const birthday = req.body.birthday

    if (!name || !surname || !job || !biography || !picture || !birthday) {
        res.status(400).send()
    }
    try {
        await Profile.findByIdAndUpdate(id,
            { name: name, surname: surname, job: job, biography: biography, picture: picture, birthday: birthday, updatedAt: Date.now() })

        res.status(201).send()
    } catch (err) {
        console.log(err)
        res.status(500).send("Error")
    }
}

controller.deleteProfile = async (req, res) => {
    const id = req.params.id

    try {
        await Profile.findByIdAndDelete(id)
        res.send()
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "El perfil no existe" })
    }
}


module.exports = controller