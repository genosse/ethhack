const unlock_siwe = new URL('https://app.unlock-protocol.com/checkout');

const redirect_uri = new URL('http://localhost:8080')

const client_id = redirect_uri.hostname;

unlock_siwe.searchParams.append('client_id', client_id);
unlock_siwe.searchParams.append('redirect_uri', redirect_uri);

console.log(unlock_siwe.toString())
