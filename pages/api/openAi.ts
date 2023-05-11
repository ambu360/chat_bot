import { NextApiRequest,NextApiResponse } from "next"
import {Configuration, OpenAIApi} from 'openai'

const configuration = new Configuration(
    {apiKey : process.env.NEXT_PUBLIC_OPENAI_KEY}
);
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){



}