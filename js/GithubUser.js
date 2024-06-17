// classe que vai conter a logica dos dados
// como os dados serao estruturados
export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint).then(data => data.json())
        .then(({ login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos, 
            followers
        })) //desse jeito ele retorna direto um objeto
    }
}