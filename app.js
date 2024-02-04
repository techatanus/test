const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // Middleware to parse JSON in the request body

// Example token generation function (replace this with your actual token generation logic)
const generateToken = async (req,res,next)=>{

    const consumerKey = "is5NBH6qKQ1QKwOS4qoSAFyMQzFZUq5Vl7q1JgVdGtZTadPB";
    const consumerSecret = "GhQNTPRkhn5evqlKhglsVvQjjSC9OwYntKheELUtnbGpaFqMy1NXArtFnwd4rGMO";

    const auth =  new Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
        "base64"
      );
  await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
     headers: {
             authorization : `Basic ${auth}`
     }
  }
  )
  .then((response)=>{
    console.log(response.data.access_token);
  let token = response.data.access_token;
    
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json(err.message);

  })

};
// Express route for handling form submission
app.post('/stk',generateToken, (req, res) => {
    async function sendStkPush() {
        // const token = await generateToken();
        const date = new Date();
        const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
    
        //you can use momentjs to generate the same in one line 
   
        const shortCode =174379; //sandbox -174379
        const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
        
  
        const stk_password = new Buffer.from(shortCode + passkey + timestamp).toString(
              "base64"
            );
  
        //choose one depending on you development environment
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        // const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      
        const headers = {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        };
      
        const requestBody = {
          "BusinessShortCode": shortCode,
          "Password": stk_password,
          "Timestamp": timestamp,
          "TransactionType": "CustomerPayBillOnline", //till "CustomerBuyGoodsOnline"
          "Amount": "10",
          "PartyA": "254798741201",
          "PartyB": shortCode,
          "PhoneNumber": "254798741201",
          "CallBackURL": "https://yourwebsite.co.ke/callbackurl",
          "AccountReference": "account",
          "TransactionDesc": "test"
        };
      
        try {
          const response = await axios.post(url, requestBody, { headers });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      }
});

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
