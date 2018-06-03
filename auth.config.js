module.exports = {
    products: {
        write: 'ownerOnly'
    },
    carts: {
        read: 'ifAuthed',
        write: 'ownerOnly'
    }
};