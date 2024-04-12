import { useSelector } from "react-redux";

export default function Profile() {
  const { currentuser } = useSelector((state) => state.user);
  return (
    <div className="pd-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentuser.avatar}
          alt="profile"
          className="rounded-full h-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="username"
          placeholder="username"
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="email"
          placeholder="email"
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="password"
          placeholder="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
