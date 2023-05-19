import { BsPlus, BsTrash, BsKey } from "react-icons/bs";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center h-screen sticky top-0 w-72 bg-slate-700">
      <button className="flex flex-row   items-center pt-2 pb-2 pl-5 m-2 border-2 rounded-md text-white text-lg w-5/6 bg-slate-800 hover:border-slate-900">
        <BsPlus className="text-3xl " />
        <p className="pl-1">New chat</p>
      </button>
      <input
        placeholder="Search conversations"
        className=" pt-2 pb-2 pl-3 mt-2 border-2 rounded-md text-white text-lg w-5/6 bg-slate-800 hover:border-slate-900"
      ></input>
      <hr className=" w-5/6  h-px my-4 bg-gray-200 border-0 bg-slate-300 " />

      <div className=" flex flex-col justify-end mb-20 w-5/6  h-full mb-5 bottom-0 items-start">
        <hr className=" w-full h-px my-4 bg-gray-200 border-0 bg-slate-300 " />
        <button className="w-full p-2 flex flex-row items-center text-white text-lg hover:border border-slate-900 rounded-md">
          <BsTrash />
          <p className="pl-2">Clear conversations</p>
        </button>
        <button className="w-full p-2 flex flex-row items-center text-white text-lg hover:border border-slate-900 rounded-md">
          <BsKey />
          <p className="pl-2">OpenAi key</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
