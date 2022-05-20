// ===================================================
// signUpErrors Handling
// ===================================================
module.exports.signUpErrors = (err) => 
{
    if (!err) return "";

    let errors = {pseudo: "", email: "", password: ""};

    if (err.message.includes('pseudo'))
    {
        errors.pseudo = "Pseudo non valide ou deja utilisé.";
    }
    
    if (err.message.includes('email'))
    {
        errors.email = "Email non valide ou deja utilisé.";
    }
    
    if (err.message.includes('password'))
    {
        errors.password = "Le password est incorrect";
    }

    if (err.message.includes('unique_pseudo'))
    {
        errors.pseudo = "Pseudo deja enregistré.";
    }
    else if (err.message.includes('unique_email'))
    {
        errors.email = "Email deja utilisé.";
    }

    return errors;
}

// ===================================================
// signInErrors Handling
// ===================================================
module.exports.signInErrors = (err) => 
{
    let errors = { email: '', password: ''}
  
    if (err.message.includes("email")) 
      errors.email = "Email inconnu";
    
    if (err.message.includes('password'))
      errors.password = "Le mot de passe ne correspond pas"
  
    return errors;
  }

// ===================================================
// uploadErrors Handling
// ===================================================
module.exports.uploadErrors = (err) => 
{
  console.log(err);
    let errors = { format: '', maxSize: ''};
  
    if (err.message.includes('invalid file'))
      errors.format = "Format incompatabile";
  
    if (err.message.includes('max size'))
      errors.maxSize = "Le fichier dépasse 500ko";

    if (err.message.includes('no file'))
      errors.maxSize = "0ko";
  
    return errors
}

// ===================================================
// updateErrors Handling
// ===================================================
module.exports.updateErrors = (err) => 
{
  console.log(err);
    let errors = { pseudo: '', moderator: ''};
  
    if (err.message.includes('pseudo'))
      errors.pseudo = "Pseudo non valide ou deja utilisé.";

    if (err.message.includes('moderator'))
      errors.moderator = "Le password moderateur n'est pas bon.";
  
    return errors
}

// ===================================================