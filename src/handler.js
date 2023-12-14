const { nanoid } = require('nanoid');
const books = require('./books');
//"linebreak-style":"off",
const addBookHandler = (request, h) => {
    // "indent":"off",
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
        // "no-else-return":"off"
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } else {
        const newBook = {
            // "max-len":"off",
            id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
        };
        // "no-trailing-spaces":"off",
        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        // console.log(newBook);
        if (isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku',
            });
            response.code(500);
            return response;
        }
    }
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    if (name) {
        const bookName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
            status: 'success',
            data: {
                books: bookName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    } else if (reading) {
        const sortBook = books.filter((book) => Number(book.reading) === Number(reading));
        const response = h.response({
            status: 'success',
            data: {
                books: sortBook.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    } else if (finished) {
        const sortBook = books.filter((book) => Number(book.finished) === Number(finished));
        const response = h.response({
            status: 'success',
            data: {
                books: sortBook.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
};

const getBookById = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(400);
        return response;
    }
};

module.exports = {
    addBookHandler, getAllBooksHandler, getBookById,
};
