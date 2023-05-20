import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import Account from "../components/Account";
import type { NextPage } from "next";
import HomePage from "@/components/HomePage";
import Sidebar from "@/components/sidebar";
const Home: NextPage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="flex justify-center flex-col items-center">
      {!session ? (
        <div className="w-4/12">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
          />
        </div>
      ) : (
        <div className="gird  w-full">
          <HomePage session={session} />
        </div>
      )}
    </div>
  );
};

export default Home;
