const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSchema = require("../Model/usermodel");
const { clearCache } = require("ejs");

exports.adminlogin = async (req,res)=>{
    res.render("admin/login");
}

exports.adminloginpost = async (req,res)=>{

    try{
    const {email,password} = req.body;

    const admin = await userSchema.findOne({email :email ,isAdmin:true});

    if ( !email || !password ) {
        req.flash("error_msg", "All fields are required");
        return res.redirect("/admin/login");
    }
   
    if(!admin){
        req.flash("error_msg", "invalid credentials");
        return res.redirect("/admin/login");
    }

    
    
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
        req.flash("error_msg", "password not match");
        return res.redirect("/admin/login");
    }

    req.session.admin = admin;


    res.redirect("/admin/dashboard");

}catch(error){
    console.log(error);
}  
}

exports.admindashboard = async (req,res)=>{
  
    

    try{
        const user = await userSchema.find({isAdmin:false});
        
        if(user.length == 0){
            return res.render("admin/dashboard", {user});
        }
        
        res.render("admin/dashboard", {user});

    }catch(error){
        if(error){
        console.log(error);
    }
    }
}


exports.edituser = async (req, res) => {
    
    try {
        
        const updatedData = req.body;
        
      console.log("backend data",updatedData);
      
        if(updatedData.username==""||updatedData.email==""){
            req.flash("error_msg", "All fields are required");
            return false;
        }
        const user1 = await userSchema.findByIdAndUpdate(updatedData.userid, updatedData, { new: true });
        
        
        
        if (!user1) {
            req.flash("error_msg", "User not found");
            return res.redirect("/admin/dashboard");
        }
        let user = await userSchema.find({isAdmin:false});
        res.render("admin/dashboard",{user});
    }catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
};


exports.createuser = async (req,res)=>{
  
     
    try{
       
        console.log(req.body);
        
        const {email, password, username , confirm_password } = req.body;

        if(!email || !password || !username || !password || !confirm_password){
            req.flash("error_msg", "All fields are required");
            return res.redirect("/admin/dashboard");

        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash("error_msg", "Invalid email address");
            return res.redirect("/admin/dashboard");
            

        }

        if(password !== confirm_password){
            req.flash("error_msg", "Passwords do not match");
            return res.redirect("/admin/dashboard");
        }

        if(password.length < 8){
            req.flash("error_msg", "Password must be at least 8 characters long");
            return res.redirect("/admin/dashboard");
        }


        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
       const user1 = new userSchema({ username, email, password: hashedPassword, isAdmin:false});
       await user1.save();


        

        res.redirect("/admin/dashboard");
   
    }catch(error){
        console.log(error);
    }
}


exports.deleteuser = async (req, res) => {
    try{
        const id = req.params.id;
        console.log("ewjbhjkebckjb",id);
        
        const user1= await userSchema.findByIdAndDelete({_id:id});
        if (!user1) {
            return res.status(404).send("User not found");
        }
        console.log("User deleted successfully");
        
        let user = await userSchema.find({isAdmin:false});
        res.render("admin/dashboard", {user});
    }catch(error){
        console.log(error);
    }
}

exports.search = async (req, res) => {
    try{
        const {search} = req.body;
        console.log("Hellooooooo",search);
        const user = await userSchema.find({
            
            $or: [
                {username: { $regex: search, $options: 'i' }},
                 {email: { $regex: search, $options: 'i' }}
                ]
            });
        res.render("admin/dashboard", {user});
    }catch(error){
        console.log(error);
    }
}


exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        } else {
            
            clearCache()
            console.log("Session destroyed");
            res.redirect("/admin/login");
            
            
        }
    });
};



