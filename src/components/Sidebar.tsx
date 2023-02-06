

const Sidebar = () => {
  return (
    <aside className="h-screen w-72 bg-slate-100 py-5">
      <h1 className="text-center">Teams</h1>
      <div className="flex justify-center mt-5">
        <button className="mr-4 bg-rose-700 text-white p-2 rounded-md">Personal</button>
        <button className="bg-rose-700 text-white p-2 rounded-md">Group</button>
      </div>

      <div className="items mt-5">

        <div className="border-2 border-indigo-500/50 mx-5 p-3">
          <p>User1</p>
        </div>
        <div className="border-2 border-indigo-500/50 mx-5 p-3 mt-5">
          <p>User2</p>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar