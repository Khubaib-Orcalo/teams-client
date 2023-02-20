

const Login = ({ creds, setCreds, submit }: any) => {
  return (
    <section className="antialiased bg-gray-200 text-gray-900 font-sans">
      <div className="flex items-center h-screen w-full">
        <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
          <span className="block w-full text-xl uppercase font-bold mb-4">Login</span>
          <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4 md:w-full">
              <label className="block text-xs mb-1">Username</label>
              <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} placeholder="Username" />
            </div>
            <div className="mb-6 md:w-full">
              <label className="block text-xs mb-1">Password</label>
              <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={creds.password} type="password" name="password" id="password" placeholder="Password" onChange={(e) => setCreds({ ...creds, password: e.target.value })
              } />
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded" onClick={() => submit()} >Login</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login