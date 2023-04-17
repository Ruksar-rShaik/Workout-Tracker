const isValidAlpha = function (value) {
    if (value.match(/^([a-z A-Z0-9]){2,50}$/)) return true
}

const validMail = (mail) => /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail);
const validNumber = (number) => (/^[6-9]{1}?[0-9]{9}$/).test(number);


const isValidPassword = (value) => {
    const passRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&#])[A-Za-z\d@$!%#?&]{8,15}$/  
    return passRegex.test(value)
};
const chkNum=(value)=>{
    return (value.match(/[0-9]/))
}
module.exports = {validMail, validNumber,isValidAlpha,isValidPassword,chkNum}
