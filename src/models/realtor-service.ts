import Realtor from "./realtor";
import { sql } from "../dbConfig";
import { checkEmail } from "../models/validation";
import { formatPhoneNumber } from "../models/formating";
import { realtorDisplay } from "../display/objectDisplay"

//WILL CHECK IF ENTERED LOGIN EMAIL AND PASSWORD MATCH DATABASE AND RETURN
//REALTOR INFORMATION OR ERROR MESSAGE
async function login(email: string, password: string): Promise<[string, Realtor[]]> {

    const emailUse = email;

    const results = await sql(`SELECT * FROM realtors WHERE email = $1`, [emailUse.toLowerCase()]);


    if (results.length && results[0][4] === emailUse.toLowerCase() && results[0][6] === password) {

        let role = results[0][3];


        return ["USER LOGGED IN - USER INFORMATION", await realtorDisplay(`SELECT * FROM realtors WHERE email = $1`, [emailUse.toLowerCase()])];

    } else {
        if (!results.length) {
            return ['Email not registered', []];
        } else {
            return ['Invalid password', []];
        }
    }
}

//WILL RETURN ALL REALTORS FOUND IN RALTORS TABLE IN DATABASE
async function showAllRealtors(field: string, sort: string): Promise<[string, Realtor[]]> {

    let fieldUse: string = field;
    let sortUse: string = sort;

    const results = await sql("SELECT * FROM REALTORS", [])


    if (sortUse === "asc") {
        return [`${results.length} REALTORS FOUND`, await realtorDisplay(`SELECT * FROM realtors order by ${fieldUse} asc`, [])];
    } else if (sortUse === "desc") {
        return [`${results.length} REALTORS FOUND`, await realtorDisplay(`SELECT * FROM realtors order by ${fieldUse} desc`, [])];
    } else {
        return ["Please select sort as ASC or DESC", []];
    };
}

//ALLOWS REALTORS TO REGISTER TO THE DATABASE. IF ENTERED INFORMATION DOES NOT PASS DATA VALIDATION
//WILL RETURN ERROR MESASGE
async function userRegistration(firstName: string, lastName: string, email: string, phone: number, password: string): Promise<string> {

    const phoneFormat = phone;

    let emailLower = email.toLowerCase();

    const formatPhone = formatPhoneNumber(phoneFormat);

    let flag = true;

    if (phone && !formatPhone) {
        return 'Please enter valid phone number';

    } else if (!firstName || !lastName || !email || !formatPhone || !password) {
        return 'Please fill out all fields';

        flag = false;

    } else if (!checkEmail(email)) {
        return 'Please enter valid email';

    } else if (password.length < 8) {
        return 'Password must be greater than 8 characters';
    } else {

        const results = await sql('SELECT * FROM realtors WHERE email = $1', [emailLower]);

        if (results.length > 0) {
            return `${email} already in use`;
        } else {
            await sql(`insert into realtors (first_name, last_name, license, email, phone, password) 
        values ($1, $2, 'associate', $3, $4, $5)`, [firstName, lastName, emailLower, formatPhone, password]);
            return `Greetings, ${firstName}. your account has been sucessfully registered`

        }
    }
}

export { realtorDisplay, formatPhoneNumber, checkEmail, login, userRegistration, showAllRealtors };