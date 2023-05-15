import { NextApiRequest,NextApiResponse } from "next"
import {Configuration, OpenAIApi} from 'openai'

const configuration = new Configuration(
    {apiKey : process.env.NEXT_PUBLIC_OPENAI_KEY}
);

const openAi = new OpenAIApi(configuration)
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    
    try {
    const completion = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: req.body
    })
    console.log(completion)
    res.status(200).json({result:completion.data});
    }catch(error){
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
  
}