const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    
    const contactService = new ContactService(MongoDB.client);
    const userId = await contactService.create(req.body);
    
        if (!userId) {
            return next(new ApiError(400, "Name already exists"));
        }

        return res.json({
            userId,
            message: 'Đăng ký thành công'
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findAll = async(req, res, next) =>{
    let documents = [];

    try{
        const contactService = new ContactService(MongoDB.client);
        const{name}=req.query;
        if(name){
            documents = await contactService.findByName(name);
        }else{
            documents = await contactService.find({});
        }
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        

        const document = await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async(req, res, next) => {
    if(Object.keys(req.body).length == 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message:"Contact was updated successfully"});
    }catch(error){
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async(req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message:"Contact was deleted successfully"});
    }catch (error){
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async(_req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

exports.login = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return next(new ApiError(400, "Username and password are required"));
        }

        const contactService = new ContactService(MongoDB.client);
        const user = await contactService.login(name, password);

        // Tạo mã thông báo hoặc session tại đây nếu cần

        return res.json({
            user,
            message: 'Đăng nhập thành công'
        }); // Hoặc trả về mã thông báo hoặc session tùy thuộc vào cách triển khai của bạn
    } catch (error) {
        return next(
            new ApiError(401, "Đăng nhập thất bại")
        );
    }
};

exports.findAllFavorite = async(_req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    }catch (error){
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite contacts"
            )
        );
    }
};


