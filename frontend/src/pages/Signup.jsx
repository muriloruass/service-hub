const Signup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-6 shadow-lg rounded-xl">
        <h1 className="text-xl font-bold mb-4">Cadastro</h1>
        <form className="flex flex-col gap-3">
          <input type="text" placeholder="Nome" className="border p-2 rounded" />
          <input type="email" placeholder="Email" className="border p-2 rounded" />
          <input type="password" placeholder="Senha" className="border p-2 rounded" />
          <select className="border p-2 rounded">
            <option value="client">Sou Cliente</option>
            <option value="provider">Sou Fornecedor</option>
          </select>
          <button className="bg-green-600 text-white p-2 rounded">Criar Conta</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
