
const checksessionLogin = (req, res, next) => {
    console.log(req.session.username,'wertyui');
    if (req.session.username) {
        
        res.redirect("/userhome");

    } else {
        next();
    }
}

const checksession = (req, res, next) =>{
    if(req.session.username){
        next();
    }else{
        res.redirect("/");
    }
}




module.exports = {checksessionLogin,checksession};



