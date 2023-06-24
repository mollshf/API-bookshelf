const { nanoid } = require('nanoid');
const dataBooks = require('./books');

const addTheBook = (request, h) => {
    // data yang akan di isi dari client
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // data dari server
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // menggabungkan data dan menyimpan ke dalam file books.js
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
    };
    let response; // menampung semua body response agar bisa di return
        // pengecekan properti name
    if (name === undefined) {
        response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        // pengecekan apakah readPage lebih besar dari pageCount
    } else if (readPage > pageCount) {
        response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        // jika semua sudah sesuai kriteria maka objek newBook bisa masuk kedalam penyimpanan(array)
    } else {
        dataBooks.push(newBook);
        const isSuccess = dataBooks.filter((book) => book.id === id).length > 0;
            if (isSuccess) {
            response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
        }
    }
    return response;
};

const getAllTheBook = (request, h) => {
    const { name, reading, finished } = request.query;

    // jika tidak terdapat permintaan di query maka tampilkan semua apa yang ada
    // non-query
    if (!name && finished === undefined && reading === undefined) {
        const books = dataBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
        const response = h.response({
            status: 'success',
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    // query
    let result = [];
    if (name) {
        result = dataBooks.filter(
        (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );
    } else if (reading !== undefined) {
        result = dataBooks.filter(
        (book) => Number(book.reading) === Number(reading),
        );
    } else if (finished !== undefined) {
        result = dataBooks.filter(
        (book) => Number(book.finished) === Number(finished),
        );
    }

    // mapping data permintaan query, untuk tidak semua data akan di tampilkan
    const books = result.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    // menampilkan buku yang sesuai dari permintaan query
    const response = h.response({
        status: 'success',
        data: {
            books,
        },
    });
    response.code(200);
    return response;
};

const getTheBookById = (request, h) => {
    const { id } = request.params;
    const book = dataBooks.filter((n) => n.id === id)[0];
    let response;

    if (book !== undefined) {
        response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
    } else {
        response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    }
    return response;
};

const editTheBookById = (request, h) => {
    // mengambil data(id) dari url
    const { id } = request.params;

    // mengambil data dari body request
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

// data dari server
    const updatedAt = new Date().toISOString();
    const index = dataBooks.findIndex((book) => book.id === id);

    // tampung method response agar bisa direturn
    let response;
    // pengecekan properti name
    if (name === undefined) {
        response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);

    // pengecekan apakah nilai properti readPage lebih besar dari pageCount
    } else if (readPage > pageCount) {
        response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
    // pengecekan apakah id sesuai dengan ya
    } else if (index !== -1) {
        dataBooks[index] = {
            ...dataBooks[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
    }
return response;
};

const deleteTheBookById = (request, h) => {
    const { id } = request.params;

    const index = dataBooks.findIndex((book) => book.id === id);
    let response;
    if (index !== -1) {
        dataBooks.splice(index, 1);
        response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
    }
    return response;
};
module.exports = {
    addTheBook,
    getAllTheBook,
    getTheBookById,
    editTheBookById,
    deleteTheBookById,
};
