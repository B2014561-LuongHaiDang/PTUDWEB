const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.book_name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while "));
    }
};

exports.findAll = async(req, res, next) =>{
    let documents = [];

    try{
        const bookService = new BookService(MongoDB.client);
        const{book_name}=req.query;
        if(book_name){
            documents = await bookService.findByName(book_name);
        }else{
            documents = await bookService.find({});
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
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id); 
        if(!document){
            return next(new ApiError(404, "Contact not found find"));
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
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not"));
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
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
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
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

exports.findAllFavorite = async(_req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.findFavorite();
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


