import jsonwebtoken from "jsonwebtoken";

const createUserToken = async(user, req, res) => {

    // create do token
    const token = jsonwebtoken.sign({
        name: user.name,
        id: user._id

    }, "complexsecret")

    // return do token
    res.status(200).json({
        message: "voce esta autenticado",
        token: token,
    })

}
export default createUserToken;