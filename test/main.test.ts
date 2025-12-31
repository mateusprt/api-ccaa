import axios from "axios";

axios.defaults.validateStatus = () => true; // se retornar 422 ele não quebra

test("Deve criar uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(200);

    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve criar uma conta com nome inválido", async () => {
    const input = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);

    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid name");
});

test("Não deve criar uma conta com email inválido", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);

    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid email");
});

test("Não deve criar uma conta com documento inválido", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "974563215",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);

    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid document");
});

test("Não deve criar uma conta com senha inválida", async () => {
    const input = {
        name: "John Dow",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);

    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid password");
});