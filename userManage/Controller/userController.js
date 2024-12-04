const { clearCache } = require("ejs");
const userSchema = require("../Model/usermodel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.registerUser = async (req, res) => {
    try {
        console.log("registerUser called", req.body);

        const { username, email, password, confirm_password } = req.body;

        
        if (!username || !email || !password || !confirm_password) {
            req.flash("error_msg", "All fields are required");
            return res.redirect("/register");
        }

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash("error_msg", "Invalid email address");
            return res.redirect("/register");
        }

        
        if (password !== confirm_password) {
            req.flash("error_msg", "Passwords do not match");
            return res.redirect("/register");
        }

        
        if (password.length < 8) {
            req.flash("error_msg", "Password must be at least 8 characters long");
            return res.redirect("/register");
        }

        
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            req.flash("error_msg", "User already exists");
            return res.redirect("/register");
        }

        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        const user = new userSchema({ username, email, password: hashedPassword });
        await user.save();

        console.log("User registered successfully");
        req.flash("success_msg", "User registered successfully");
        res.redirect("/");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const user = await userSchema.findOne({ email });

        if (username == "" || email == "" || password == "") {
            req.flash("error_msg", "All fields are required");
            return res.redirect("/");
        }

        if (!user) {
            console.log("User not found");
            req.flash("error_msg", "User not found");
            return res.redirect("/");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Invalid password");
            req.flash("error_msg", "Invalid password");
            return res.redirect("/");
        }

        req.session.email = user.email;
        req.session.username = user.username;

        console.log(req.session.username);

        console.log(user);
        
        

        res.redirect("/userhome");
    } catch (error) {
        console.error("Error logging in:", error);
        req.flash("error_msg", " An error occurred while logging in");
        res.redirect("/");
    }
};

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        } else {
            res.clearCookie("connect.sid");
            console.log("Session destroyed");
            res.redirect("/");
        }
    });
};

exports.userlogin = (req, res) => {
    try {
        if (req.session.username) {
            return res.redirect("/userhome");
        } else {
            res.render("user/login");
        }
    } catch (error) {
        console.error("Error rendering login page:", error);
    }
};

exports.userregister = (req, res) => {
    res.render("user/register", { message: "" });
};

exports.userHome = (req, res) => {

    const email = req.session.email;
    let message = req.session.username;

    res.render("user/userhome", { message, email });
};

// exports.alldata = async (req, res) => {
//     try {
//         const users = await userSchema.find();
//         if (users.length === 0) {
//             return req.flash("error_msg", "No users found");
//         }
        
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).send("Error fetching users");
//     }
// };

exports.create = async (req, res) => {
    try {
        const userData = new userSchema(req.body);
        const { email } = userData;

        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).send("User already exists");
        }
        await userData.save();
        res.status(201).json(userData);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
};

exports.updatedata = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const user = await userSchema.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
};

exports.deletedata = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userSchema.findById({ _id: id });
        if (!user) {
            return res.status(404).send("User not found");
        }
        await userSchema.findByIdAndDelete(id);

        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
};
