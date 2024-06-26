const { ObjectId } = require("mongodb");
class ContactService {
    constructor(client) {
        this.contact = client.db().collection("contacts");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const contact = {
            holot: payload.holot,
            name: payload.name,
            phai: payload.phai,
            gioitinh: payload.gioitinh,
            address: payload.address,
            phone: payload.phone,
            password: payload.password,
            favorite: payload.favorite,
        };
        // Remove undefined fields
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }

    async create(payload) {
        const existingUsers = await this.findByName(payload.name);
        if (existingUsers.length > 0) {
            return null;
        }
    
        const contact = this.extractConactData(payload);
        const result = await this.contact.insertOne(contact);
        return result.insertedId;
    }

    async find(filter) {
        const cursor = await this.contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite() {
        return await this.find({ favorite: false });
    }

    async deleteAll() {
        const result = await this.contact.deleteMany({});
        return result.deletedCount;
    }

    async login(username, password) {
        const user = await this.contact.findOne({ name: username });
        if (!user) {
            throw new Error("User not found");
        }
    
        // Kiểm tra mật khẩu
        if (user.password !== password) {
            throw new Error("Incorrect password");
        }
    
        // Trả về thông tin người dùng nếu xác thực thành công
        return user;
    }
}
module.exports = ContactService;