import {supabase} from './../lib/supabaseClient'


export default function Home({countries}) {
  
  console.log(countries)
  return (
    
      <ul>
        {countries && countries.map(country=>(
          <li key={country.id}>{country.name}</li>
        ))
          
        }
      </ul>
    
  )
}

export async function getServerSideProps(){
let {data} = await supabase.from('countries').select()
  return {
    props:{
      countries:data
    },
  }
}