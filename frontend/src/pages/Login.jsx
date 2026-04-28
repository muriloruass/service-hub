const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-6 shadow-lg rounded-xl">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form className="flex flex-col gap-3">
          <input type="email" placeholder="Email" className="border p-2 rounded" />
          <input type="password" placeholder="Senha" className="border p-2 rounded" />
          <button className="bg-blue-600 text-white p-2 rounded">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
