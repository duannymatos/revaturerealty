//Formats phonenumber xxxxxxxxxx to (xxx) xxx-xxxx
function formatPhoneNumber(phone: number): string | null {
    //Filter only numbers from the input
    let cleaned = ('' + phone).replace(/\D/g, '');

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
    };

    return null
};

function formatPrice(price: number): string | null {
    //Filter only numbers from the input
    let cleaned = ('' + price).replace(/\D/g, '');

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})$/);

    if (match) {
        return `$${match[1]},${match[2]}`
    };

    return null
};


export { formatPhoneNumber };