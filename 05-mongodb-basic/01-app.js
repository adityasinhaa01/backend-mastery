const mongoose = require('mongoose');

mongoose
    .connect("mongodb+srv://<USERNAME>:<DBPASSWORD>@cluster0.f6irrq5.mongodb.net/")
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log(error);
    });

// Schema definition:
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 18 },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

//User Model

const User = mongoose.model('User', userSchema);

//Creating user
async function runQueryExample() {
    try {
        // const newUser = await User.create({
        //     name: "Alex Morgan",
        //     email: "alex.morgan@example.com",
        //     age: 21,
        //     tags: ['Developer', 'Designer', 'AIML']
        // })

        const newUser = new User({
            name: "Deleted User",
            email: "deleteduser@example.com",
            age: 87,
            isActive: true,
            tags: ['aged', 'test-data']
        })

        await newUser.save();

        console.log(`Created new user: ${newUser}`);

    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// runQueryExample();

//finding all users

async function getAllUsers() {
    try {
        const allUsers = await User.find({});
        console.log(allUsers);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// getAllUsers();

// Finding users based on criteria

async function getInactiveUsers() {
    try {
        const allUsers = await User.find({ isActive: false });
        console.log(allUsers);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// getInactiveUsers();

//User.findOne({ <---criteria---> }) -> will return the first user meeting that criteria

// fetch selected fields only

async function getSelectedInfo() {
    try {
        const allUsers = await User.find({}).select('-_id');
        console.log(allUsers);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// getSelectedInfo();

// limited users
async function getLimiteduser() {
    try {
        const allUsers = await User.find({}).limit(2).skip(1); // give 2 users only skipping the first one
        console.log(allUsers);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// getLimiteduser();

// sorted output

async function getSortedInfo() {
    try {
        const allUsers = await User.find({}).sort({ age: -1 });  // 1 -> ascending order && -1 -> descending order
        console.log(allUsers);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// getSortedInfo();

// count on criteria

async function getCountOf() {
    try {
        const count = await User.countDocuments({ age: { $lt: 25 } });
        console.log(count);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// getCountOf();

// delete a user

async function deleteUser() {
    try {
        const name = "Deleted User";
        const mailID = "deleteduser@example.com";

        const deletedUser = await User.findOneAndDelete({
            name: name,    // name: { $regex: `^${name}$`, $options: "i" },
            email: mailID  // email: { $regex: `^${mailID}$`, $options: "i" }
        });

        if (!deletedUser) {
            console.log(`No such user with Name: ${name} and Email ID: ${mailID} exists`);
        } else console.log(deletedUser);
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// deleteUser();

// Update Users

async function updateUser() {
    try {
        const name = "jane smith";
        const mailID = "jane.smith@example.com";

        const updatedUser = await User.findOneAndUpdate(
            {
                name: { $regex: `^${name}$`, $options: "i" },
                email: { $regex: `^${mailID}$`, $options: "i" }
            },
            {
                $set: {
                    age: 47,
                    isActive: true
                }
            },
            {
                new: true,  //returnDocument: 'after'
                runValidators: true
            }
        );

        if (!updatedUser) {
            console.log(`No such user with Name: ${name} and Email ID: ${mailID} exists`);
        } else {
            console.log("Updated user:", updatedUser);
        }
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

// updateUser();