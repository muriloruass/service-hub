const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('🚀 Iniciando Testes de Validação...');
    
    try {
        // 1. Testar Registro de Usuário (Provedor)
        console.log('\n--- Testando Registro de Usuário ---');
        const signupRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Murilo Provedor',
            email: `murilo_${Date.now()}@test.com`,
            password: 'password123',
            type: 'provider'
        });
        const token = signupRes.data.token;
        const providerId = signupRes.data.user.id;
        console.log('✅ Registro OK!');

        // 2. Testar Login
        console.log('\n--- Testando Login ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: signupRes.data.user.email,
            password: 'password123'
        });
        console.log('✅ Login OK!');

        // 3. Testar Criação de Serviço
        console.log('\n--- Testando CRUD de Serviços ---');
        // Para criar um serviço, precisamos de um cliente (vamos usar o que criamos para o review)
        const clientSignup = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Cliente Teste',
            email: `cliente_${Date.now()}@test.com`,
            password: 'password123',
            type: 'client'
        });
        const clientToken = clientSignup.data.token;
        const clientId = clientSignup.data.user.id;

        const serviceRes = await axios.post(`${API_URL}/services`, {
            title: 'Consultoria Técnica',
            description: 'Apoio em projetos de TI',
            price: 150,
            clientId: clientId,
            executionDate: new Date()
        }, { headers: { Authorization: `Bearer ${token}` } });
        const serviceId = serviceRes.data._id;
        console.log('✅ Criação de Serviço OK!');

        // 4. Testar Criação de Review (Simulando um cliente)
        console.log('\n--- Testando Reviews e NPS ---');

        await axios.post(`${API_URL}/reviews`, {
            serviceId: serviceId,
            rating: 10,
            comment: 'Excelente serviço!'
        }, { headers: { Authorization: `Bearer ${clientToken}` } });
        console.log('✅ Review (Nota 10) criada!');

        // 5. Validar NPS
        const npsRes = await axios.get(`${API_URL}/nps`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        console.log('\n📊 Relatório de NPS:', npsRes.data);
        
        console.log('\n✨ TODOS OS TESTES PASSARAM COM SUCESSO!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERRO NOS TESTES:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

runTests();
