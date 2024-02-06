const axios = require('axios');

// generate token function
const generateToken = async(req,res,next)=>{
   
    const consumerKey = "Jc6Ztr8PZLvNOmHAWvk8LMaSIAA6Xt7Ib3ogJeZJ7DH4M9JM";
    const consumerSecret = "uClioBnxVmpSp36bCawetG5DSFbBJkbujKdJ7sFKh7A0OaFdzeJ9e2MndTbiyAGD"; 

    const auth =  new Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
        "base64"
      );
  await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
     headers: {
             authorization : `Basic ${auth}`
     }
  }) .then((response)=>{
    token = response.data.access_token;
    console.log(response.data);

      next();
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json(err.message);

  });
}
// stk push 
const stkPush = async(req,res)=>{
    const shortCode =174379 ;//174379
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const email = req.body.email;
    const name = req.body.name;
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    const date = new Date();
    const timestamp =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
       
        const stk_password = Buffer.from(shortCode + passkey + timestamp).toString(
        'base64'
        );
        const data = {
            BusinessShortCode:shortCode,
            Password:stk_password,
            Timestamp:timestamp,
            TransactionType: "CustomerBuyGoodsOnline",//CustomerPayBillOnline
            Amount: amount,
            PartyA:`254${phone}`,
            PartyB:shortCode,
            PhoneNumber:`254${phone}`,
            CallBackURL: "https://mydomain.com/pat",
            AccountReference:"devTech ltd",
            TransactionDesc:"Testing stk push"
         };
         await axios.post(url,data,{
                headers:{
                    authorization: `Bearer ${token}`
                },
            }) .then((data)=>{
                // console.log(data);
                res.status(200).json(data.data);

            }).catch((err)=>{
                       console.log(err);
                       res.status(400).json(err.message);
            });

};







module.exports = {generateToken,stkPush}