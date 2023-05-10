import {useState,useEffect} from 'react'
import { useUser,useSupabaseClient } from '@supabase/auth-helpers-react'
import ChatSession from './chat_session'
export default function HomePage ({session}){
const supabase = useSupabaseClient()
const user = useUser()
const [username,SetUsername] = useState()
const [loading,setLoading] = useState(false)   

useEffect(()=>{
    getUserProfile()
})

async function getUserProfile(){
    try{
        setLoading(true)

        let {data,error,status} = await supabase
        .from('profiles')
        .select('username, website,avatar_url')
        .eq('id', user.id)
        .single()

        if(error&& status !== 406){
            throw error
        }
        if(data){
            SetUsername(data.username)
        }
    }catch(error){
        console.log(error)
    }
}
return(
        <main className='flex justify-center flex-col items-center p-5 w-4/12'>
            <div className=''>
                <h1>CHAT BOT</h1>
            </div>
            <h3>{username}</h3>
            <button onClick={()=>(supabase.auth.signOut())}>Sign Out</button>
            <ChatSession/>
        </main>
    )
}