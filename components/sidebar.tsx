import { BsPlus, BsTrash, BsKey } from "react-icons/bs";
import {VscSignOut} from 'react-icons/vsc'


interface SidebarProps {
  handleSignOut:() => void
}
const Sidebar = ({ handleSignOut }: SidebarProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center h-screen sticky top-0 w-72 bg-slate-700">
      <button className="flex flex-row   items-center pt-1 pb-1 pl-5 m-2 border-2 rounded-md text-white text-md w-5/6 bg-slate-800 hover:border-slate-900">
        <BsPlus className="text-3xl " />
        <p className="pl-1">New chat</p>
      </button>
      <input
        placeholder="Search conversations"
        className=" pt-2 pb-2 pl-3 mt-2 border-2 rounded-md text-white text-md w-5/6 bg-slate-800 hover:border-slate-900"
      ></input>
      <hr className=" w-5/6  h-px my-4 bg-gray-200 border-0 bg-slate-300 " />

      <div className=" flex flex-col justify-end mb-20 w-5/6  h-full mb-5 bottom-0 items-start">
        <hr className=" w-full h-px my-4 bg-gray-200 border-0 bg-slate-300 " />
        <button className="border border-slate-700 rounded-md w-full p-2 flex flex-row items-center text-white text-md hover:border-slate-900 ">
          <BsTrash />
          <p className="pl-2">Clear conversations</p>
        </button>
        <button className="border border-slate-700 rounded-md w-full p-2 flex flex-row items-center text-white text-md hover:border-slate-900 ">
          <BsKey />
          <p className="pl-2">OpenAi key</p>
        </button>
        <button onClick={handleSignOut} className="border border-slate-700 rounded-md w-full p-2 flex flex-row items-center text-white text-md hover:border-slate-900 ">
          <VscSignOut />
          <p className="pl-2">Sign Out</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
