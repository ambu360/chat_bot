import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import {useState,useEffect} from 'react'
import Account from '../components/Account'
import type { NextPage } from 'next';
import HomePage from '@/components/HomePage'
const Home:NextPage  = () => {

  const session = useSession()
  const supabase = useSupabaseClient()
  
  //varaiables tracked for opnai
  const [value,setvalue] = useState<string>('')
  const [prompt,setPrompt] = useState<string>('')
  const [completion,setCompletion] = useState<boolean>(false)

   
  return (
    <div className="flex justify-center flex-col items-center" style={{ padding: '50px 0 100px 0' }}>
      {!session ? (
        <div className='p-5 w-4/12'>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
          </div>
      ) : (
        <HomePage session={session}/>
      )}
    </div>
  )
}

export default Home