const { nanoid } = require('nanoid');
let books = require('./books');

const addBookHandler = (request, h) => {
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

    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

        const id = nanoid(16)
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage ? true : false;


        books.push ({
        name, 
        year, 
        author, 
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        insertedAt,
        updatedAt,
        finished,
    });

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if(isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        }

        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
};

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} =request.query;
    if(name) {
        let books = books.filter((book) => book.name.toLowerCase() === name.toLowerCase());
        return h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);
    }

    if(reading) {
        let books = books.filter((book) => Number(book.reading) === reading);
        return h.response({
            status:'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
    }

    if(finished) {
        let books = books.filter((book) => Number(book.finished) === finished);
        return h.response({
            status:'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
    }

    if (!name && !reading && !finished){
        return h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
    }
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((book) => book.id === bookId)[0];

    if(book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

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

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1){
        books[index] = {
            ...books[index],
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
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

const deleteBookByIdHandler = (request, h) => {
      const {bookId} = request.params;
      const index = books.findIndex((book) => book.id === bookId);
      if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

    module.exports = {
      addBookHandler, 
      getAllBooksHandler, 
      getBookByIdHandler, 
      editBookByIdHandler, 
      deleteBookByIdHandler
    };