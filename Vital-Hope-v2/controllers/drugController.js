import axios from "axios";

export const recommendDisease = async (req,res)=>{

try{

const response = await axios.post(
"http://localhost:9000/predict",
req.body
)

res.json(response.data)

}catch(error){

res.status(500).json({error:"ML service error"})

}

}