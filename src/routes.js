const {
    addTheBook, getAllTheBook, getTheBookById, editTheBookById, deleteTheBookById,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addTheBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllTheBook,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getTheBookById,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editTheBookById,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteTheBookById,
    },
];

module.exports = routes;
